import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  facebook: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  twitter: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  instagram: (props: SVGProps<SVGSVGElement>) => (
     <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        {...props}
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  appStore: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 300 68" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="300" height="68" rx="8" fill="black"/>
        <path d="M26.4 20.8C26.4 17.6 28 14.8 30.4 14.8C32.8 14.8 34.4 17.6 34.4 20.8C34.4 24 32.8 26.8 30.4 26.8C28 26.8 26.4 24 26.4 20.8ZM30.4 12C26.4 12 23.2 15.6 23.2 20.8C23.2 26 26.4 29.6 30.4 29.6C34.4 29.6 37.6 26 37.6 20.8C37.6 15.6 34.4 12 30.4 12ZM42 20.8C42 17.6 43.6 14.8 46 14.8C48.4 14.8 50 17.6 50 20.8C50 24 48.4 26.8 46 26.8C43.6 26.8 42 24 42 20.8ZM46 12C42 12 38.8 15.6 38.8 20.8C38.8 26 42 29.6 46 29.6C50 29.6 53.2 26 53.2 20.8C53.2 15.6 50 12 46 12Z" fill="white"/>
        <path d="M189.6 46.8L186.4 46.8L186.4 34H189.6L189.6 46.8ZM196.4 46.8L193.2 46.8L193.2 34H196.4L196.4 46.8Z" fill="white"/>
    </svg>
  ),
  googlePlay: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 300 68" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="300" height="68" rx="8" fill="black"/>
        <path d="M22.4 13.6L36.8 21.2L32.8 23.6L22.4 13.6ZM21.2 12L38.8 22.4L40.4 21.2L21.2 12ZM40.4 26L38.8 25.2L21.2 35.6L22.4 34L40.4 26ZM22.4 34L32.8 24L36.8 26.4L22.4 34Z" fill="white"/>
    </svg>
  ),
  paymentMethods: (props: SVGProps<SVGSVGElement>) => (
    <svg width="195" height="25" viewBox="0 0 195 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="0.5" y="0.5" width="37" height="24" rx="2.5" fill="white" stroke="#E5E5E5"/>
        <path d="M20.4 13.8V11.2H24.4V13.8H20.4ZM11.6 11.2V13.8H15.6V11.2H11.6Z" fill="#0070BA"/>
        <rect x="39.5" y="0.5" width="37" height="24" rx="2.5" fill="white" stroke="#E5E5E5"/>
        <path d="M60.4 13.8V11.2H64.4V13.8H60.4ZM51.6 11.2V13.8H55.6V11.2H51.6Z" fill="#F9A000"/>
        <rect x="78.5" y="0.5" width="37" height="24" rx="2.5" fill="white" stroke="#E5E5E5"/>
        <path d="M99.4 13.8V11.2H103.4V13.8H99.4ZM90.6 11.2V13.8H94.6V11.2H90.6Z" fill="#00A9E0"/>
        <rect x="117.5" y="0.5" width="37" height="24" rx="2.5" fill="white" stroke="#E5E5E5"/>
        <path d="M138.4 13.8V11.2H142.4V13.8H138.4ZM129.6 11.2V13.8H133.6V11.2H129.6Z" fill="#003087"/>
        <rect x="156.5" y="0.5" width="37" height="24" rx="2.5" fill="white" stroke="#E5E5E5"/>
        <path d="M177.4 13.8V11.2H181.4V13.8H177.4ZM168.6 11.2V13.8H172.6V11.2H168.6Z" fill="#EB001B"/>
    </svg>
  )
};
