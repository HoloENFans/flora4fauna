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
						depending on the amount you donate. (Except
						<strong>January 3rd</strong>, where the tree will be
						randomly sakura colored) Every
						<strong> $1 donated equals one tree.</strong>
					</p>

					<h2>Tree Leaves</h2>
					<p>
						An individual donation with a message written will be
						added to a queue before growing on the World Tree as a
						leaflet. To stop forest fires, messages may be omitted
						entirely from the tree to prevent flaming. Messages may
						be altered by our team for text compatibility, sizing,
						and/or translations. We reserve the right to modify,
						omit, and/or reject the submitted username and/or
						message that we deem inappropriate or offensive.
					</p>
					<br />
					<p>
						Rejected messages are not refunded and are not eligible
						for refund. Donations are final after the Make My
						Donation submission.
					</p>
					<br />
					<p>
						TLDR: Donations are manually vetted for username and
						messages before displaying on the tree. Rejected
						messages are not displayed. Messages are not eligible
						for refund if rejected.
					</p>

					<h2>Accountability</h2>
					<p>
						This is a non-profit fan graduation project as a
						celebration of Ceres Fauna. This unofficial project is
						not affiliated with COVER Corp., Hololive Production, or
						the entity YAGOO.
					</p>
					<br />
					<p>
						All donations in full amount will go towards the
						501(c)(3) Arbor Day Foundation (<a
							href="https://shop.arborday.org/faq#commemorative-faq"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>) as handled by the third party service Make My
						Donation (<a
							href="https://www.makemydonation.org/page-faq"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>). Our fan group & volunteer team do not receive any
						part of the donations made.
					</p>
					<p>
						An impact report from the Arbor Day Foundation will be
						generated afterward to summarize the donation drive
						shortly after closing. An annual report will follow to
						track progress on trees planted.
					</p>

					<p>
						For full donation receipts and documentation for tax
						purposes, please reach out to the Arbor Day Foundation,
						a US registered 501(c)(3). (<a
							href="https://www.arborday.org/contact"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>)
					</p>

					<h2>Privacy</h2>
					<p>
						This fan-made website does not process, store, nor
						handle personal financial information. This website
						utilizes only donor-submitted basic information of
						username, message, and donation amount. This basic
						information is received from Make My Donation after the
						donation is made.
					</p>
					<br />
					<p>We only store information if you donate, which is:</p>
					<ul>
						<li>The username provided by you</li>
						<li>The message provided by you</li>
						<li>The amount you have donated</li>
					</ul>

					<h2>Credits</h2>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<h3>⭐ Organizer</h3>
							<ul>
								<li>ArtOfBart - <a href="">X / Twitter</a></li>
								<li>
									GoldElysium -
									<a
										href="https://github.com/GoldElysium"
										rel="noreferrer"
										target="_blank"
										>GitHub</a
									>
								</li>
								<li>NinjaStahr - <a href="">X / Twitter</a></li>
							</ul>
						</div>

						<div>
							<h3>🎨 Art & Assets</h3>
							<ul>
								<li>
									Bayuu -
									<a
										href="https://x.com/Baiyuu_"
										rel="noreferrer"
										target="_blank"
										>X / Twitter</a
									>
								</li>
								<li>
									Kebbi (Loading sapling) -
									<a
										href="https://x.com/IMKebbie"
										rel="noreferrer"
										target="_blank"
										>X / Twitter</a
									>
								</li>
								<li>
									FalcoDJ (Loading dots) -
									<a
										href="https://falcodj.itch.io/"
										rel="noreferrer"
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
									<a
										href="https://github.com/GoldElysium"
										rel="noreferrer"
										target="_blank"
										>Github</a
									>
								</li>
								<li>
									Tactician_Walt -
									<a
										href="https://x.com/walt280"
										rel="noreferrer"
										target="_blank"
										>X / Twitter</a
									>
								</li>
								<li>
									goose -
									<a
										href="https://x.com/SanityUnderflow"
										rel="noreferrer"
										target="_blank"
										>X / Twitter</a
									>
								</li>
								<li>
									Hiro -
									<a
										href="https://x.com/hiroavrs"
										rel="noreferrer"
										target="_blank"
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
									<a
										href="https://x.com/the_arkhand"
										rel="noreferrer"
										target="_blank"
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

					<h2>Special Thanks From ArtOfBlart</h2>
					<p>
						Big thanks to Baiyuu for amazing art on a quick timeline
						with multiple rounds. I was shocked at the timing,
						availability, and luck. TSKR!
					</p>
					<br />
					<p>
						Thank you to the entire development team for working
						across finals, holidays, time zones, and OTHER fan
						projects…HOW?! All of you built this website faster than
						it took Fauna to finish the Minecraft World Tree…HOW?!
					</p>
					<br />
					<p>
						And to all the other hololive fans, VTuber enjoyers, and
						lurkers. There is no perfect way to say goodbye. Work
						hard to find something that celebrates the memory,
						especially if it’s silly! o7
					</p>

					<h2>Contact</h2>
					<p>
						For any inquiries, please contact
						<a
							href="mailto:flora4fauna@project.holoen.fans"
							target="_blank"
							>flora4fauna&#64;projects.holoen.fans</a
						>.
					</p>

					<p class="mt-4 text-center">
						Hosted by
						<a href="https://holoen.fans" target="_blank"
							>holoen.fans</a
						>
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
