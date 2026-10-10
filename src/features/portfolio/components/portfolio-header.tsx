import { getLocale, getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { ResumeMenu } from '@/features/resume/components/resume-menu';
import { resumeProfiles } from '@/features/resume/model/presentation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitch } from '@/components/ui/language-switch';
import { BrandMark } from '@/components/ui/brand-mark';

export async function PortfolioHeader() {
  const t = await getTranslations('Portfolio');
  const locale = await getLocale();
  const resumeT = await getTranslations('Resume');
  return (
    <>
      <a className="pf-skip" href="#main">
        {t('skip')}
      </a>
      <header className="pf-header">
        <a
          className="pf-wordmark"
          href="#main"
          aria-label="Ebrahim Hamidi"
          lang="en"
          dir="ltr"
        >
          <BrandMark className="pf-header-mark" />
        </a>
        <nav className="pf-nav" aria-label={t('navigation')}>
          <a href="#work">{t('work')}</a>
          <a href="#experience">{t('experience')}</a>
          <a href="#contact">{t('contact')}</a>
          <ResumeMenu
            label={resumeT('menu')}
            links={resumeProfiles.map((entry) => ({
              profile: entry.id,
              href: getPathname({ href: `/resume/${entry.id}`, locale }),
            }))}
          />
        </nav>
        <div className="pf-toolbar">
          <a className="ui-button pf-header-contact" href="#contact">
            {t('contact')}
          </a>
          <LanguageSwitch
            href={getPathname({
              href: '/',
              locale: locale === 'fa' ? 'en' : 'fa',
            })}
            label={t('languageLabel')}
            code={locale === 'fa' ? 'EN' : 'FA'}
          />
          <ThemeToggle label={t('themeToggle')} />
        </div>
      </header>
    </>
  );
}
