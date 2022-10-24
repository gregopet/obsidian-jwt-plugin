import { Plugin, TextFileView, MarkdownRenderer, TFile, FileStats, Component } from 'obsidian';

export default class JwtPlugin extends Plugin {

	async onload() {
		
		// Takes the content of this block, decodes it and displays the JWT info.
		// The JWT Claims Set are pretty-printed by the simple trick of creating a
		// Markdown renderer and inserting a JSON code block into it, letting Obsidian
		// color the resulting code.
		this.registerMarkdownCodeBlockProcessor("jwt", (source, el, ctx) => {
			try {
				const jwtAsJson = parseJwt(source.trim());
				MarkdownRenderer.renderMarkdown(
					"```json\n" + jwtAsJson + "\n```",
					el, '', {} as Component 
				)
			} catch (e) {
				const errorMessage = el.createEl("h2");
				errorMessage.addClass("jwt-error");
				errorMessage.setText("Error decoding JWT!");
				el.appendChild(errorMessage);
			}
		});


		
	}
}

/** Takes a JWT token and decodes its Claims Set, returning it as string. */
function parseJwt(token: string) {
    return Buffer.from(token.split('.')[1], 'base64').toString();
}