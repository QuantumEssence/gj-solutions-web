import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Stethoscope,
  PhoneCall,
  ShieldAlert,
  FileText,
  Lock,
  Copy,
  Check,
  Search,
  Laptop
} from "lucide-react";

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled && setControlledOpen) {
        setControlledOpen(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, setControlledOpen]
  );

  // Global keyboard shortcut listener: Cmd+K (macOS) & Ctrl+K (Windows/Linux)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop with tactile blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{
              duration: 0.25,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="relative w-full max-w-xl overflow-hidden rounded-xl bg-slate-900 border border-slate-700/60 shadow-2xl shadow-teal-950/30 text-slate-100 craft-border z-10"
          >
            <Command
              label="Global Command Palette"
              className="w-full flex flex-col font-sans"
            >
              {/* Search Bar Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search pages..."
                  className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-700">
                  ESC
                </kbd>
              </div>

              {/* Command Results List */}
              <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700">
                <Command.Empty className="py-6 text-center text-sm text-slate-400">
                  No matching commands or pages found.
                </Command.Empty>

                {/* Navigation Group */}
                <Command.Group
                  heading="Navigation"
                  className="px-2 py-1.5 text-xs font-semibold text-teal-400/90 tracking-wider uppercase [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => navigate("/"))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 cursor-pointer select-none transition-colors aria-selected:bg-teal-600/20 aria-selected:text-teal-200 data-[selected=true]:bg-teal-600/20 data-[selected=true]:text-teal-200 hover:bg-slate-800/80"
                  >
                    <Home className="w-4 h-4 text-teal-400" />
                    <span className="flex-1">Home</span>
                    <span className="text-[11px] font-mono text-slate-500">/</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate("/services"))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 cursor-pointer select-none transition-colors aria-selected:bg-teal-600/20 aria-selected:text-teal-200 data-[selected=true]:bg-teal-600/20 data-[selected=true]:text-teal-200 hover:bg-slate-800/80"
                  >
                    <Stethoscope className="w-4 h-4 text-teal-400" />
                    <span className="flex-1">Medical Services</span>
                    <span className="text-[11px] font-mono text-slate-500">/services</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate("/about"))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 cursor-pointer select-none transition-colors aria-selected:bg-teal-600/20 aria-selected:text-teal-200 data-[selected=true]:bg-teal-600/20 data-[selected=true]:text-teal-200 hover:bg-slate-800/80"
                  >
                    <User className="w-4 h-4 text-teal-400" />
                    <span className="flex-1">About Clinical Team</span>
                    <span className="text-[11px] font-mono text-slate-500">/about</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate("/contact"))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 cursor-pointer select-none transition-colors aria-selected:bg-teal-600/20 aria-selected:text-teal-200 data-[selected=true]:bg-teal-600/20 data-[selected=true]:text-teal-200 hover:bg-slate-800/80"
                  >
                    <PhoneCall className="w-4 h-4 text-teal-400" />
                    <span className="flex-1">Contact & Appointments</span>
                    <span className="text-[11px] font-mono text-slate-500">/contact</span>
                  </Command.Item>
                </Command.Group>

                {/* Actions Group */}
                <Command.Group
                  heading="Actions & Tools"
                  className="mt-2 px-2 py-1.5 text-xs font-semibold text-teal-400/90 tracking-wider uppercase [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
                >
                  <Command.Item
                    onSelect={() => runCommand(handleCopyLink)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 cursor-pointer select-none transition-colors aria-selected:bg-teal-600/20 aria-selected:text-teal-200 data-[selected=true]:bg-teal-600/20 data-[selected=true]:text-teal-200 hover:bg-slate-800/80"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="flex-1">
                      {copied ? "Link Copied to Clipboard!" : "Copy Page URL"}
                    </span>
                    <kbd className="text-[10px] font-mono text-slate-500 bg-slate-800/70 px-1.5 py-0.5 rounded border border-slate-700">
                      Ctrl+C
                    </kbd>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate("/admin"))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 cursor-pointer select-none transition-colors aria-selected:bg-teal-600/20 aria-selected:text-teal-200 data-[selected=true]:bg-teal-600/20 data-[selected=true]:text-teal-200 hover:bg-slate-800/80"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="flex-1">Admin Dashboard Portal</span>
                    <span className="text-[11px] font-mono text-slate-500">/admin</span>
                  </Command.Item>
                </Command.Group>

                {/* Policy & Compliance Group */}
                <Command.Group
                  heading="Compliance & Legal"
                  className="mt-2 px-2 py-1.5 text-xs font-semibold text-teal-400/90 tracking-wider uppercase [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => navigate("/privacy-policy"))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 cursor-pointer select-none transition-colors aria-selected:bg-teal-600/20 aria-selected:text-teal-200 data-[selected=true]:bg-teal-600/20 data-[selected=true]:text-teal-200 hover:bg-slate-800/80"
                  >
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                    <span className="flex-1">Privacy Policy</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => navigate("/terms-of-service"))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 cursor-pointer select-none transition-colors aria-selected:bg-teal-600/20 aria-selected:text-teal-200 data-[selected=true]:bg-teal-600/20 data-[selected=true]:text-teal-200 hover:bg-slate-800/80"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="flex-1">Terms of Service</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Footer status bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 text-[11px] text-slate-400">
                <span className="flex items-center gap-2">
                  <Laptop className="w-3.5 h-3.5 text-slate-500" />
                  <span>Athena Medical Care • Command Center</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>Navigate</span>
                  <kbd className="font-mono bg-slate-800 px-1 rounded text-slate-300">↑</kbd>
                  <kbd className="font-mono bg-slate-800 px-1 rounded text-slate-300">↓</kbd>
                  <span>Select</span>
                  <kbd className="font-mono bg-slate-800 px-1 rounded text-slate-300">↵</kbd>
                </span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandMenu;
