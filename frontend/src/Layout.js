// At the top, replace:
// import { base44 } from "@/api/base44Client";
// import { UserProgress } from "@/entities/UserProgress";
// import { User as UserEntity } from "@/entities/User";

// With:
import { base44 } from './api/apiClient';
import { useAuth } from './contexts/AuthContext';

// Then in the component, replace:
// const currentUser = await UserEntity.me();
// With:
const currentUser = await base44.entities.User.me();

// And replace:
// const progress = await UserProgress.filter({user_email: currentUser.email});
// With:
const progress = await base44.entities.UserProgress.filter({user_email: currentUser.email});