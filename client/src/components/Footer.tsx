import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-4 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold flex items-center">
              <Globe className="h-5 w-5 mr-2" /> Global Time Viewer
            </h3>
            <p className="text-neutral-300 text-sm mt-1">Track time across the world with precision</p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
            <a href="#" className="text-neutral-300 hover:text-white text-sm">About</a>
            <a href="#" className="text-neutral-300 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-neutral-300 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-neutral-300 hover:text-white text-sm">Contact</a>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-4 pt-4 text-sm text-neutral-400">
          © 2023 Global Time Viewer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
