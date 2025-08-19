import { FileEditor } from "./FileEditor";
import { FileTree } from "./FileTree";
import { RefreshCw } from "lucide-react";
import { useLoadApp } from "@/hooks/useLoadApp";
import { useAtomValue } from "jotai";
import { selectedFileAtom } from "@/atoms/viewAtoms";
import { useMemo } from "react";

interface App {
  id?: number;
  files?: string[];
}

export interface EzCodeViewProps {
  loading: boolean;
  app: App | null;
}

// Filter function to get only user-editable UI/UX files
const filterUserEditableFiles = (files: string[]): string[] => {
  // Define patterns for user-editable files
  const editablePatterns = [
    // Source files in components (but NOT ui folder) and pages
    /^src\/components\/(?!ui\/).*\.(tsx|jsx|ts|js)$/,
    /^src\/pages\//,
    // Style files (excluding globals.css as it's usually not user-edited)
    /^src\/App\.css$/,
    // Main app files
    /^src\/App\.(tsx|jsx|ts|js)$/,
    /^src\/main\.(tsx|jsx|ts|js)$/,
    /^src\/index\.(tsx|jsx|ts|js)$/,
    // Layout files
    /^src\/layout\.(tsx|jsx|ts|js)$/,
    /^src\/layouts\//,
    // Root index.html
    /^index\.html$/,
  ];

  // Filter out files that should not be shown
  const excludePatterns = [
    // UI library components (shadcn/ui)
    /^src\/components\/ui\//,
    // Lib and utils folders
    /^src\/lib\//,
    /^src\/utils\//,
    // Public folder
    /^public\//,
    // Config files
    /^postcss\.config\.(js|cjs|mjs|ts)$/,
    /^tailwind\.config\.(ts|js|cjs|mjs)$/,
    // Test files
    /\.(test|spec)\.(tsx?|jsx?)$/,
    /__tests__\//,
    // Type definition files
    /\.d\.ts$/,
    // Build artifacts
    /^dist\//,
    /^build\//,
    /\.vite\//,
    // Node modules
    /node_modules\//,
    // Lock files and configs users shouldn't edit
    /package-lock\.json$/,
    /yarn\.lock$/,
    /pnpm-lock\.yaml$/,
    // Hidden files
    /^\./,
  ];

  return files.filter((file) => {
    // First check if it should be excluded
    if (excludePatterns.some((pattern) => pattern.test(file))) {
      return false;
    }

    // Then check if it matches editable patterns
    return editablePatterns.some((pattern) => pattern.test(file));
  });
};

// Ez Code view component that displays only user-editable UI/UX files
export const EzCodeView = ({ loading, app }: EzCodeViewProps) => {
  const selectedFile = useAtomValue(selectedFileAtom);
  const { refreshApp } = useLoadApp(app?.id ?? null);

  // Filter files to show only user-editable ones
  const filteredFiles = useMemo(() => {
    if (!app?.files) return [];
    return filterUserEditableFiles(app.files);
  }, [app?.files]);

  if (loading) {
    return <div className="text-center py-4">Loading files...</div>;
  }

  if (!app) {
    return (
      <div className="text-center py-4 text-gray-500">No app selected</div>
    );
  }

  if (filteredFiles.length > 0) {
    return (
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center p-2 border-b space-x-2">
          <button
            onClick={() => refreshApp()}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !app.id}
            title="Refresh Files"
          >
            <RefreshCw size={16} />
          </button>
          <div className="text-sm text-gray-500">
            {filteredFiles.length} editable files (UI/UX)
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 overflow-auto border-r">
            <FileTree files={filteredFiles} />
          </div>
          <div className="w-2/3">
            {selectedFile && filteredFiles.includes(selectedFile.path) ? (
              <FileEditor appId={app.id ?? null} filePath={selectedFile.path} />
            ) : (
              <div className="text-center py-4 text-gray-500">
                Select a file to view
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-4 text-gray-500">
      No editable UI/UX files found
    </div>
  );
};
