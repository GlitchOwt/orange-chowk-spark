'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  FacebookIcon, 
  InstagramIcon, 
  LinkedinIcon, 
  YoutubeIcon,
  Heart,
  Users,
  Sparkles,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Community',
		links: [
			{ title: 'About Orange Chowk', href: '/about' },
			{ title: 'Join Waitlist', href: '#waitlist' },
			{ title: 'Events', href: '/events' },
			{ title: 'Success Stories', href: '/stories' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Creative Guidelines', href: '/guidelines' },
			{ title: 'Community Rules', href: '/rules' },
			{ title: 'Help & Support', href: '/help' },
			{ title: 'Contact Us', href: '/contact' },
		],
	},
	{
		label: 'Legal',
		links: [
			{ title: 'Privacy Policy', href: '/privacy' },
			{ title: 'Terms of Service', href: '/terms' },
			{ title: 'Code of Conduct', href: '/conduct' },
			{ title: 'Cookie Policy', href: '/cookies' },
		],
	},
	{
		label: 'Connect',
		links: [
			{ title: 'Instagram', href: 'https://instagram.com/orangechowk', icon: InstagramIcon },
			{ title: 'LinkedIn', href: 'https://linkedin.com/company/orangechowk', icon: LinkedinIcon },
			{ title: 'YouTube', href: 'https://youtube.com/@orangechowk', icon: YoutubeIcon },
			{ title: 'Email Us', href: 'mailto:hello@orangechowk.com', icon: Mail },
		],
	},
];

export function Footer() {
	return (
		<footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl md:rounded-t-6xl border-t bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-rose-50/80 backdrop-blur-sm px-6 py-12 lg:py-16 mt-16">
			{/* Decorative top border */}
			<div className="bg-orange-500/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				{/* Brand Section */}
				<AnimatedContainer className="space-y-4">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
							<Heart className="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 className="text-xl font-bold text-orange-900" style={{ fontFamily: 'Youth Medium, sans-serif' }}>
								orange <span className="text-orange-500">chowk</span>
							</h3>
						</div>
					</div>
					
					<p className="text-orange-700 text-sm leading-relaxed max-w-sm">
						A curated, emotionally intelligent community for Indian creatives who build, share, and grow together.
					</p>
					
					<div className="flex items-center gap-4 text-orange-600 text-sm">
						<div className="flex items-center gap-2">
							<Users className="w-4 h-4" />
							<span>500+ Creatives</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin className="w-4 h-4" />
							<span>12+ Cities</span>
						</div>
					</div>
					
					<p className="text-orange-600/70 mt-8 text-xs">
						© {new Date().getFullYear()} Orange Chowk. Made with ❤️ for Indian creatives.
					</p>
				</AnimatedContainer>

				{/* Links Grid */}
				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs font-semibold text-orange-900 uppercase tracking-wider mb-4">
									{section.label}
								</h3>
								<ul className="space-y-3">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="text-orange-700 hover:text-orange-500 inline-flex items-center transition-all duration-300 text-sm group"
												target={link.href.startsWith('http') ? '_blank' : undefined}
												rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
											>
												{link.icon && (
													<link.icon className="me-2 w-4 h-4 group-hover:scale-110 transition-transform" />
												)}
												<span className="group-hover:translate-x-1 transition-transform">
													{link.title}
												</span>
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>

			{/* Bottom Section */}
			<AnimatedContainer delay={0.6} className="w-full mt-12 pt-8 border-t border-orange-200/50">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex items-center gap-6 text-orange-600 text-sm">
						<span>Built for creators, by creators</span>
						<div className="flex items-center gap-2">
							<Sparkles className="w-4 h-4" />
							<span>AI-Curated Community</span>
						</div>
					</div>
					
					<div className="flex items-center gap-4">
						<span className="text-orange-600 text-sm">Follow our journey:</span>
						<div className="flex gap-3">
							{[
								{ icon: InstagramIcon, href: 'https://instagram.com/orangechowk' },
								{ icon: LinkedinIcon, href: 'https://linkedin.com/company/orangechowk' },
								{ icon: YoutubeIcon, href: 'https://youtube.com/@orangechowk' }
							].map((social, index) => (
								<motion.a
									key={index}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center text-orange-600 hover:text-orange-700 transition-all duration-200"
									whileHover={{ scale: 1.1, y: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									<social.icon className="w-4 h-4" />
								</motion.a>
							))}
						</div>
					</div>
				</div>
			</AnimatedContainer>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};