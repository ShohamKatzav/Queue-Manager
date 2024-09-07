import styles from './NotFound.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Whoops! This page took a wrong turn.</p>
        <p className={styles.submessage}>
          (Maybe it's on a coffee break. Pages need those too, you know?)
        </p>
        <a href="/" className={styles.button}>
          Take me back to familiar territory
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;