import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PingYourMentor - 套磁决策助手',
  description: 'AI驱动的多维度分析，帮您了解导师、评估匹配度、识别风险、制定策略',
  keywords: ['套磁', '导师', 'AI', '分析', '决策助手', '留学', '申请'],
  authors: [{ name: 'PingYourMentor' }],
  openGraph: {
    title: 'PingYourMentor - 套磁决策助手',
    description: 'AI驱动的多维度分析，帮您了解导师、评估匹配度、识别风险、制定策略',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PingYourMentor - 套磁决策助手',
    description: 'AI驱动的多维度分析，帮您了解导师、评估匹配度、识别风险、制定策略',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
