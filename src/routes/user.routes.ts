import { Router } from 'express';
import * as userController from '@/controllers/user.controller';

const router = Router();

// We are organizing by the resource, so a POST to "/" on this router
// corresponds to a POST to "/users" in the main server file.
router.post('/signup', userController.signup);
router.post('/login', userController.login);

export default router;