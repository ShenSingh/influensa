import {Router} from "express";


import {userRouter} from "./user.routes";
import authRouters from "./auth.routers";
import {influencerRouter} from "./influencer.routers";
import {socialMediaRouter} from "./socialMedia.routers";
import {businessDetailsRouter} from "./businessDetails";

const rootRouter = Router()

rootRouter.use("/auth", authRouters)
rootRouter.use("/user", userRouter);
rootRouter.use("/influencer", influencerRouter);
rootRouter.use("/socialMedia", socialMediaRouter);
rootRouter.use("/businessDetails", businessDetailsRouter);

export default rootRouter
