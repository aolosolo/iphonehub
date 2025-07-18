
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ipoint.ae',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.independent.co.uk',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'ivenus.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thundermac.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.classic-phones.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'static-01.daraz.pk',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'image.made-in-china.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.olx.com.pk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'myshop.pk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '5.imimg.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'talk.tidbits.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.roamcdn.net',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'openbox.ca',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'technoshop.pk',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'shopivate.pk',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'casedrip.pk',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'cdn.homeshopping.pk',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'images.priceoye.pk',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'appleshop.com.pk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'applehub.pk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'jumbosouq.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'mac-more.co.ke',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tjmart.pk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'games4u.pk',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
