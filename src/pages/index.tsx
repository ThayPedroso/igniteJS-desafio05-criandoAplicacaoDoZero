import { GetStaticProps } from 'next';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <main className={styles.container}>
      <header>
        <img src="/images/Logo.svg" alt="logo" />
      </header>
      <div className={styles.posts}>
        {postsPagination.results.map(post => (
          <a key={post.uid}>
            <strong>{post.data.title}</strong>
            <p>{post.data.subtitle}</p>
            <div>
              <div className={styles.updatedAt}>
                <FiCalendar />
                <time>{post.first_publication_date}</time>
              </div>
              <div className={styles.author}>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
            </div>
          </a>
        ))}
        {postsPagination.next_page ? (
          <button type="button">Carregar mais posts</button>
        ) : (
          ''
        )}
      </div>
    </main>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.last_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
