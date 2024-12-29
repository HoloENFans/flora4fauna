import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('about-modal')
export class AboutModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	handleModalClosed() {
		this.isOpen = false;
	}

	render() {
		return html`
			<base-modal
				.isOpen=${this.isOpen}
				@modal-closed=${() => this.handleModalClosed()}
			>
				<h1 class="text-center" slot="header">
					Flora4Fauna Fan Project
				</h1>

				<div class="separator" slot="separator"></div>

				<div slot="content">
					<h2>To Fauna</h2>
					<p>Message for funny haha green woman here</p>

					<h2>Overview</h2>
					<p>
						By donating, you can get a leaf on the tree on this site
						with your username and a message, with the leaf color
						depending on the amount you donate. (With exception of
						<strong>January 3rd</strong>, where the tree will be
						randomly sakura colored) Every
						<strong> $1 donated equals one tree.</strong>
					</p>

					<h2>Tree Leaves</h2>
					<p>
						Any donations with messages written will be added to a
						queue to be displayed on the
						<strong>World Tree leaflets</strong>. To stop forest
						fires, messages may be omitted entirely from the tree to
						prevent flaming. Furthermore, messages may be altered by
						our team for text compatibility, sizing, and/or
						translations. After checks the message will be added to
						the World Tree in groups.
					</p>
					<br />
					<p>
						In other words: Your donation will
						<strong>NOT</strong> immediately be added to the tree,
						as all usernames and messages will be manually vetted
						first. We reserve the right to modify or reject your
						username or message that we deem inappropriate or
						offensive.
					</p>

					<h2>Affiliation</h2>
					<p>
						This is a fan graduation project for Fauna,
						<strong>not affiliated</strong> with COVER Corp. or
						affiliates. The money you donate will mostly go to the
						Arbor Day Foundation, which will use the money to plant
						trees globally. Part of your money will for example go
						to payment processing fees, you can find the exact split
						by clicking on <strong>“Accountability”</strong> on the
						bottom navigation menu. Want to know more about the
						Arbor Day Foundation? Click
						<a href="https://www.arborday.org/" target="_blank"
							>here</a
						>.
					</p>

					<h2>Privacy</h2>
					<p>
						If you choose to donate, only your username, message,
						and the amount you donated will be stored in our
						database. No other personal information will be stored.
					</p>

					<h2>Credits</h2>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<h3>⭐ Organizer</h3>
							<ul>
								<li>ArtOfBart - <a href="">X / Twitter</a></li>
								<li>NinjaStahr - <a href="">X / Twitter</a></li>
							</ul>
						</div>

						<div>
							<h3>⭐ Lead Developer, Organizer</h3>
							<ul>
								<li>
									GoldElysium - <a href="">X / Twitter</a>
								</li>
							</ul>
						</div>

						<div>
							<h3>🎨 Art & Assets</h3>
							<ul>
								<li>
									Bayuu -
									<a
										href="https://x.com/Baiyuu_"
										target="_blank"
										>X / Twitter</a
									>
								</li>
								<li>
									Kebbi (Loading sapling) -
									<a
										href="https://x.com/IMKebbie"
										target="_blank"
										>X / Twitter</a
									>
								</li>
								<li>
									FalcoDJ (Loading dots) -
									<a
										href="https://falcodj.itch.io/"
										target="_blank"
										>Itch.io</a
									>
								</li>
							</ul>
						</div>

						<div>
							<h3>💻 Developers</h3>
							<ul>
								<li>
									GoldElysium -
									<a href="https://x.com/GoldElysium"
										>X / Twitter</a
									>
									-
									<a href="https://github.com/GoldElysium"
										>Github</a
									>
								</li>
								<li>
									Tactician_Walt -
									<a href="https://x.com/walt280"
										>X / Twitter</a
									>
								</li>
								<li>
									goose -
									<a href="https://x.com/SanityUnderflow"
										>X / Twitter</a
									>
								</li>
								<li>
									Hiro -
									<a href="https://x.com/hiroavrs"
										>X / Twitter</a
									>
								</li>
							</ul>
						</div>
						<div>
							<h3>🎵 Music</h3>
							<ul>
								<li>
									Arkhand -
									<a href="https://x.com/the_arkhand"
										>X / Twitter</a
									>
								</li>
							</ul>
						</div>
					</div>
					<h2>Special Thanks</h2>
					<p>
						MakeMyDonation for their quick work on implementing
						requested changes, and Arbor Day Foundation for willing
						to work on a very short timeline project.
					</p>

					<h2>Contact</h2>
					<p>
						For any inquiries, please contact
						<a href="mailto:" target="_blank">insert mail here</a>.
					</p>
				</div>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'about-modal': AboutModal;
	}
}
