import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

const links = {
  'SQL':
  {
    title: 'SQL questions',
    link: '/docs/category/sql-questions',
    color: 'success',
  },
  'Python': [
    {
      title: 'Python questions 1',
      link: '/docs/category/python-questions',
      color: 'secondary',
    },
    {
      title: 'Python questions 2',
      link: '/docs/category/python-questions-2',
      color: 'secondary',
    },
  ],
  'Data Visualization':
  {
    title: 'Data Visualization questions',
    link: '/docs/data-questions',
    color: 'danger',
  },

}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div style={
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '1rem',
          }
        }>
          {Object.entries(links).map(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map((item) => (
                <div className={styles.buttons} key={item.title}>
                  <Link
                    className={`button button--${item.color} button--lg`}
                    to={item.link}>
                    {item.title}
                  </Link>
                </div>
              ));
            } else {
              return (
                <div className={styles.buttons} key={value.title}>
                  <Link
                    className={`button button--${value.color} button--lg`}
                    to={value.link}>
                    {value.title}
                  </Link>
                </div>
              );
            }
          })}
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Desafio rio Kin">
      <HomepageHeader />
    </Layout>
  );
}
