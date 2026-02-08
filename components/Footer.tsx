import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-22 h-full bg-rise-red rounded-full flex items-center justify-center">
                <Image
                  src="https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/Asset%207@2x.webp"
                  alt=""
                  width={150}
                  height={150}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">RISE AGAIN HOLDINGS LTD</h3>
                <p className="text-gray-400 text-sm">REAL ASSEST, REAL VALUE</p>
              </div>
            </div>
            <p className="text-gray-400">
              Premium real estate investment and luxury property management.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Properties</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#listings"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Available Listings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Luxury Villas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Commercial
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Investment
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-400">
                Email: contact@riseagainholdings.com
              </li>
              <li className="text-gray-400">Phone: +1 (555) 123-4567</li>
              <li className="text-gray-400">
                Address: 123 Luxury Lane, Premium City
              </li>
            </ul>
            <button className="mt-6 bg-rise-red text-white px-6 py-2.5 font-medium hover:bg-red-700 transition-colors">
              Get In Touch
            </button>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Rise Again Holdings Ltd. All rights
            reserved.
          </p>
          <div className="mt-4 text-sm">
            <a href="#" className="hover:text-white transition-colors mx-4">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors mx-4">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors mx-4">
              DPA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
