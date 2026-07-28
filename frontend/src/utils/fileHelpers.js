// Mirrors backend/constants.js LANGUAGE_EXTENSIONS — kept in sync manually since
// frontend and backend are separate packages without a shared module.
export const LANGUAGE_EXTENSIONS = {
  javascript: [".js", ".jsx", ".mjs", ".cjs"],
  typescript: [".ts", ".tsx"],
  python: [".py"],
  java: [".java"],
  cpp: [".cpp", ".cc", ".cxx", ".hpp", ".h"],
  c: [".c"],
  ruby: [".rb"],
  go: [".go"],
  rust: [".rs"],
};

export const MAX_UPLOAD_FILE_SIZE = 300 * 1024; // 300kb, matches backend

const EXTENSION_TO_LANGUAGE = Object.entries(LANGUAGE_EXTENSIONS).reduce(
  (map, [language, extensions]) => {
    extensions.forEach((ext) => (map[ext] = language));
    return map;
  },
  {}
);

export const ACCEPTED_EXTENSIONS = Object.keys(EXTENSION_TO_LANGUAGE).join(",");

/**
 * Reads a File as text and detects its language from the extension.
 * Rejects unsupported extensions and oversized files with a friendly message.
 */
export function readCodeFile(file) {
  return new Promise((resolve, reject) => {
    const ext = "." + file.name.split(".").pop().toLowerCase();
    const language = EXTENSION_TO_LANGUAGE[ext];

    if (!language) {
      reject(
        new Error(
          `Unsupported file type "${ext}". Supported: ${Object.values(LANGUAGE_EXTENSIONS).flat().join(", ")}`
        )
      );
      return;
    }

    if (file.size > MAX_UPLOAD_FILE_SIZE) {
      reject(
        new Error(
          `File is too large (${Math.round(file.size / 1024)}kb). Max size is ${Math.round(MAX_UPLOAD_FILE_SIZE / 1024)}kb.`
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve({ code: String(reader.result), language, fileName: file.name });
    reader.onerror = () => reject(new Error("Could not read that file. Please try again."));
    reader.readAsText(file);
  });
}
