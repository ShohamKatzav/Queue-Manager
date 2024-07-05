import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';

function Home() {
  const [cookies, removeCookie] = useCookies(['user']);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    removeCookie("user", { });
    navigate('/');
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>WELCOME HOME</div>
          <div>{cookies?.user?.email}</div>
          <button type="submit" className={styles.button}>Log out</button>
        </form>
      </div>

    </>
  )
}

export default Home;