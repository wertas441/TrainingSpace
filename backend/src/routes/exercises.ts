import {authGuard} from "../middleware/authMiddleware";
import router from "./activity";

router.get('/exercises/exercises-list', authGuard, async (req, res) => {

});

export default router;
