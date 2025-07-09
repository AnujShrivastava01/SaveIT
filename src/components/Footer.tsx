
import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-slate-300 text-center">
            Made with ❤️ by Anuj
          </p>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/AnujShrivastava01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/anujshrivastava1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
