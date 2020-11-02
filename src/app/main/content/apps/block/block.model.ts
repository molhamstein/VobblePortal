import { User } from "../users/user.model";

export class Block {
  id: string;
  createdAt: string;
  ownerId: string;
  userId: string;
  owner: User;
  user: User;

  constructor(block) {
    this.id = block.id; // || FuseUtils.generateGUID();
    this.createdAt = block.createdAt || "";
    this.userId = block.userId || "";
    this.ownerId = block.ownerId || "";
    this.owner = block.owner || { username: "", image: "" };
    this.user = block.user || { username: "", image: "" };
  }
}
