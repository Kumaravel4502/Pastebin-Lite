import PasteStore from '../models/PasteStore.js';
import { getNow } from '../utils/getNow.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export const viewPasteHtml = async (req, res) => {
    try {
        const { id } = req.params;
        const now = getNow(req);

        // Atomic operation: find and update only if constraints are met
        const paste = PasteStore.findByIdAndUpdate(
            id,
            {
                $and: [
                    {
                        $or: [
                            { expiresAt: null },
                            { expiresAt: { $gt: now } }
                        ]
                    }
                ]
            },
            { $inc: { viewCount: 1 } },
            { new: true }
        );

        if (!paste) {
            return res.status(404).send('Not Found');
        }

        // Escape HTML to prevent XSS
        const escapedContent = escapeHtml(paste.content);

        const html = generateHTML('Paste', `<pre class="paste-content">${escapedContent}</pre>`);
        res.send(html);
    } catch (error) {
        console.error('View paste error:', error);
        res.status(404).send('Not Found');
    }
};

function generateHTML(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Pastebin Lite</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; padding: 2rem; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { margin-bottom: 1rem; color: #38bdf8; }
    .paste-content { background: #1e293b; padding: 1.5rem; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
    .error { color: #f87171; background: #1e293b; padding: 1rem; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    ${body}
  </div>
</body>
</html>`;
}

