import { useRouter } from 'next/dist/client/router';
import GameMode from '../../components/head-copy/game_mode';

export default function Highscores() {
    const router = useRouter();
    const query = router.query;
    const scoreTime = [].concat(query.scoretime)[0] || null;

    return <></>

}