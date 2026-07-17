import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";

export default function UserConnectionsTab({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl"
    >
      <div>
        <h3 className="font-bold text-foreground text-lg">Third-Party Connections</h3>
        <p className="text-sm text-muted-foreground mt-1">Social media profiles and developer integrations linked to this user's account.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl border border-border bg-accent/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-foreground text-background">
              <GithubIcon size={22} />
            </div>
            <div>
              <div className="font-bold text-foreground">GitHub</div>
              <div className="text-xs text-muted-foreground">
                {user.connections?.GITHUB ? `github.com/${user.connections.GITHUB}` : "No GitHub account linked"}
              </div>
            </div>
          </div>
          {user.connections?.GITHUB && (
            <a
              href={`https://github.com/${user.connections.GITHUB}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold hover:bg-accent flex items-center gap-1.5 transition-colors"
            >
              Visit Profile <ExternalLink size={13} />
            </a>
          )}
        </div>

        <div className="p-4 rounded-2xl border border-border bg-accent/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#0A66C2] text-white">
              <LinkedinIcon size={22} />
            </div>
            <div>
              <div className="font-bold text-foreground">LinkedIn</div>
              <div className="text-xs text-muted-foreground">
                {user.connections?.LINKEDIN ? `linkedin.com/in/${user.connections.LINKEDIN}` : "No LinkedIn account linked"}
              </div>
            </div>
          </div>
          {user.connections?.LINKEDIN && (
            <a
              href={`https://linkedin.com/in/${user.connections.LINKEDIN}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold hover:bg-accent flex items-center gap-1.5 transition-colors"
            >
              Visit Profile <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
