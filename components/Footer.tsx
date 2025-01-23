'use client';
import React from 'react';

import {
  FaDiscord,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCheckPathname } from 'hooks/useCheckPathname';

function Footer() {
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  const { includesElements } = useCheckPathname();
  return (
<footer className={`sm:mb-7 lg:mb-14 p-10 ${includesElements('/chat/') || includesElements('/meeting') || includesElements('/played') || includesElements('/profile/settings') || includesElements('/profile/dashboard') || includesElements('/club/') || includesElements('/competition/') || (includesElements('/competition/') && !includesElements('/form/'))  ? 'hidden' : ' grid gap-4 sm:grid-flow-row lg:grid-flow-col *:grid  *:gap-1 *:place-items-start place *:place-content-start text-sm font-medium  '} ${!isDarkModed ? " bg-primary-color" : "bg-secondary-color"} text-white`}>
  <nav>
    <header className={`footer-title ${isDarkModed ? "text-primeColor" : "text-accColor"}`}>Services</header>
    <Link href={''} className="link link-hover">Advertisement</Link>
  </nav>
  <nav>
    <header className={`footer-title ${isDarkModed ? "text-primeColor" : "text-accColor"}`}>Company</header>
    <Link className="link link-hover" href="/about-us">About us</Link>
    <Link href="/contact" className="link link-hover">Contact</Link>
    <Link className="link link-hover" href={''}>Jobs</Link>
  </nav>
  <nav>
    <header className={`footer-title ${isDarkModed ? "text-primeColor" : "text-accColor"}`}>Resources</header>
    <Link href="/blog" className="link link-hover">Blog</Link>
    <Link href="/faq" className="link link-hover">FAQs</Link>
    <Link href="/support" className="link link-hover">Support</Link>
  </nav>
  <nav>
    <header className={`footer-title ${isDarkModed ? "text-primeColor" : "text-accColor"}`}>Legal</header>
    <Link href="/privacy-policy" className="link link-hover">Privacy Policy</Link>
    <Link href="/terms" className="link link-hover">Terms of Service</Link>
    <Link href="/cookies" className="link link-hover">Cookie Policy</Link>
  </nav>

</footer>
  );
}

export default Footer;
