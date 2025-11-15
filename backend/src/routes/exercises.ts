import {authGuard} from "../middleware/authMiddleware";
import router from "./activity";
import {ExerciseListFrontendStructure} from "../types/exercisesBacknendTypes";

router.get('/exercises/exercises-list', authGuard, async (req, res) => {
    const {id, name, difficulty, description, partOfTheBody}: ExerciseListFrontendStructure = req.query;



});

export default router;
