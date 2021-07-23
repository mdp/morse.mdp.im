import { useRouter } from 'next/dist/client/router';
import GameMode from '../../components/head-copy/game_runner';

export default function Play() {
    const router = useRouter();
    const query = router.query;
    const mode = [].concat(query.mode)[0] || null;

    //TODO: Handle error if game doesn't exist
    if (mode) {
        return <GameMode mode={[].concat(query.mode)[0]}></GameMode>
    } else {
        return <></>
    }

}
