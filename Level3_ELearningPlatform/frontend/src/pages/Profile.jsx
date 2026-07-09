import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-lg">
        <div className="bg-chalk border border-line rounded-chip p-7 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-amber text-ink font-display text-2xl flex items-center justify-center">
              {user?.avatarInitials}
            </div>
            <div>
              <p className="font-display text-xl text-ink">{user?.name}</p>
              <p className="text-sm text-slate">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-line pt-5">
            <div>
              <p className="text-2xl font-display text-amber-dark">{user?.totalHoursLearned}h</p>
              <p className="text-xs text-slate mt-1">Learned</p>
            </div>
            <div>
              <p className="text-2xl font-display text-moss">{user?.streak}</p>
              <p className="text-xs text-slate mt-1">Day streak</p>
            </div>
            <div>
              <p className="text-2xl font-display text-ink">{user?.certificatesEarned}</p>
              <p className="text-xs text-slate mt-1">Certificates</p>
            </div>
          </div>
        </div>

        <div className="bg-chalk border border-line rounded-chip p-7">
          <p className="text-sm font-medium text-ink mb-1">Account</p>
          <p className="text-xs text-slate mb-5">
            Member since {new Date(user?.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
