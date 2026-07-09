// Latest-release lookup for the Download button.
// The app ships from GitHub Releases on iden0605/Backloggr; until the first
// public release exists this fetch 404s and callers fall back to RELEASES_URL.

const REPO = "iden0605/Backloggr";
export const RELEASES_URL = `https://github.com/${REPO}/releases/latest`;

export interface WindowsRelease {
  version: string;
  url: string;
}

interface GithubAsset {
  name: string;
  browser_download_url: string;
}

interface GithubRelease {
  tag_name: string;
  assets: GithubAsset[];
}

function pickWindowsInstaller(assets: GithubAsset[]): GithubAsset | undefined {
  // Prefer the .msi, then the NSIS setup .exe.
  return (
    assets.find((a) => a.name.toLowerCase().endsWith(".msi")) ??
    assets.find((a) => a.name.toLowerCase().endsWith(".exe"))
  );
}

export async function fetchLatestWindowsRelease(): Promise<WindowsRelease | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const release = (await res.json()) as GithubRelease;
    const asset = pickWindowsInstaller(release.assets ?? []);
    if (!asset) return null;
    return {
      version: release.tag_name.replace(/^v/, ""),
      url: asset.browser_download_url,
    };
  } catch {
    return null;
  }
}
