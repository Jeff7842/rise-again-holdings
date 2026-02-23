package main

import (
	"context"
	"crypto/subtle"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

type Server struct {
	db  *pgxpool.Pool
	key string
}

type jsonErr struct {
	Error string `json:"error"`
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func loadEnvUpwards(filename string) error {
	dir, err := os.Getwd()
	if err != nil {
		return err
	}

	for {
		path := filepath.Join(dir, filename)
		if _, statErr := os.Stat(path); statErr == nil {
			return godotenv.Load(path)
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			break // hit filesystem root
		}
		dir = parent
	}

	return errors.New("could not find " + filename + " in any parent directory")
}

func main() {
// Non-fatal in prod; fatal in dev if you want strictness
	if err := loadEnvUpwards(".env.local"); err != nil {
		log.Println("env load:", err)
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is required")
	}
	bootstrapKey := os.Getenv("ADMIN_BOOTSTRAP_KEY_GO")
	if bootstrapKey == "" {
		log.Fatal("ADMIN_BOOTSTRAP_KEY is required")
	}
	

	ctx := context.Background()
	db, err := pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatal(err)
	}

	s := &Server{db: db, key: bootstrapKey}

	r := chi.NewRouter()

	// Health
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) })

	// Admin auth
	r.Post("/auth/admin/login", s.adminLogin)

	// Admin user management (bootstrap-protected)
	r.Post("/admin/users", s.createAdminUser)

    //debug email
	r.Get("/debug/admin", s.getAdminByEmail)

	//reset password
	r.Post("/admin/users/reset-password", s.resetAdminPassword)

	log.Println("API listening on  http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

/* -----------------------------
   CREATE ADMIN (BOOTSTRAP KEY)
------------------------------*/

type createAdminReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"` // admin | super_admin (optional)
}

func (s *Server) createAdminUser(w http.ResponseWriter, r *http.Request) {

	log.Println("BOOTSTRAP expected:", s.key)
	log.Println("BOOTSTRAP got:", r.Header.Get("X-Admin-Bootstrap-Key"))

	// Simple guard: require header key
	got := r.Header.Get("X-Admin-Bootstrap-Key")
	if subtle.ConstantTimeCompare([]byte(got), []byte(s.key)) != 1 {
		writeJSON(w, http.StatusUnauthorized, jsonErr{Error: "unauthorized"})
		return
	}

	var req createAdminReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, jsonErr{Error: "invalid json"})
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" {
		writeJSON(w, http.StatusBadRequest, jsonErr{Error: "email and password are required"})
		return
	}

	role := req.Role
	if role == "" {
		role = "admin"
	}
	if role != "admin" && role != "super_admin" {
		writeJSON(w, http.StatusBadRequest, jsonErr{Error: "role must be admin or super_admin"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, jsonErr{Error: "hashing failed"})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var id string
	err = s.db.QueryRow(ctx, `
		insert into private.user_admin (email, password_hash, role)
		values ($1, $2, $3)
		returning id
	`, req.Email, string(hash), role).Scan(&id)

	if err != nil {
		// Likely unique violation on email
		writeJSON(w, http.StatusConflict, jsonErr{Error: "email already exists"})
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{
		"id":    id,
		"email": req.Email,
		"role":  role,
	})
}

/* -----------------------------
   LOGIN (VERIFY PASSWORD)
------------------------------*/

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginResp struct {
	ID          string   `json:"id"`
	Email       string   `json:"email"`
	Role        string   `json:"role"`
	Permissions []string `json:"permissions"`
}

func (s *Server) adminLogin(w http.ResponseWriter, r *http.Request) {
	var req loginReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, jsonErr{Error: "invalid json"})
		return
	}
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" {
		writeJSON(w, http.StatusBadRequest, jsonErr{Error: "email and password are required"})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var (
		id           string
		email        string
		hash         string
		role         string
		isActive     bool
	)
	err := s.db.QueryRow(ctx, `
		select id, email, password_hash, role, is_active
		from private.user_admin
		where email = $1
	`, req.Email).Scan(&id, &email, &hash, &role, &isActive)

	if err != nil {
		// Don’t leak whether the email exists
		writeJSON(w, http.StatusUnauthorized, jsonErr{Error: "invalid credentials"})
		return
	}
	if !isActive {
		writeJSON(w, http.StatusUnauthorized, jsonErr{Error: "account disabled"})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)) != nil {
		writeJSON(w, http.StatusUnauthorized, jsonErr{Error: "invalid credentials"})
		return
	}

	// Update last_login_at (best-effort)
	_, _ = s.db.Exec(ctx, `
		update private.user_admin set last_login_at = now()
		where id = $1
	`, id)

	// Minimal permission mapping (expand later)
	perms := permissionsForRole(role)

	writeJSON(w, http.StatusOK, loginResp{
		ID:          id,
		Email:       email,
		Role:        role,
		Permissions: perms,
	})
}

func permissionsForRole(role string) []string {
	switch role {
	case "super_admin":
		return []string{"admin:access", "admin:users:write", "admin:settings:write", "admin:all"}
	case "admin":
		return []string{"admin:access", "admin:listings:write", "admin:users:read"}
	default:
		return []string{"admin:access"}
	}
}

//reset password
type resetReq struct {
	Email       string `json:"email"`
	NewPassword string `json:"new_password"`
}

func (s *Server) resetAdminPassword(w http.ResponseWriter, r *http.Request) {
	got := r.Header.Get("X-Admin-Bootstrap-Key")
	if subtle.ConstantTimeCompare([]byte(got), []byte(s.key)) != 1 {
		writeJSON(w, http.StatusUnauthorized, jsonErr{Error: "unauthorized"})
		return
	}

	var req resetReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, jsonErr{Error: "invalid json"})
		return
	}

	email := strings.TrimSpace(strings.ToLower(req.Email))
	if email == "" || req.NewPassword == "" {
		writeJSON(w, http.StatusBadRequest, jsonErr{Error: "email and new_password are required"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, jsonErr{Error: "hashing failed"})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	tag, err := s.db.Exec(ctx, `
		update private.user_admin
		set password_hash=$2
		where email=$1
	`, email, string(hash))

	if err != nil {
		log.Printf("DB ERROR: %v", err)
writeJSON(w, 500, jsonErr{Error: "db error"})
		return
	}
	if tag.RowsAffected() == 0 {
		writeJSON(w, http.StatusNotFound, jsonErr{Error: "not found"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"ok": true})
}

/* ---------------
   DEBUG THE DATABASE
   ---------------*/
   func (s *Server) getAdminByEmail(w http.ResponseWriter, r *http.Request) {
	email := strings.TrimSpace(strings.ToLower(r.URL.Query().Get("email")))
	if email == "" {
		writeJSON(w, http.StatusBadRequest, jsonErr{Error: "email query param is required"})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var id, role string
	var isActive bool
	err := s.db.QueryRow(ctx, `
		select id, role, is_active
		from private.user_admin
		where email=$1
	`, email).Scan(&id, &role, &isActive)

	if err != nil {
		writeJSON(w, http.StatusNotFound, jsonErr{Error: "not found"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"id":        id,
		"email":     email,
		"role":      role,
		"is_active": isActive,
	})
}

// Optional helper if you want later:
var ErrUnauthorized = errors.New("unauthorized")