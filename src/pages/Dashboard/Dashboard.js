import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboard } from '../../store/slices/dashboardSlice';
import LeaveBalanceCard from './LeaveBalanceCard';
import StatisticsCard from './StatisticsCard';
import UpcomingLeaves from './UpcomingLeaves';
import RecentLeaveActivity from './RecentLeaveActivity';
import DashboardSkeleton from './DashboardSkeleton';
import './Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const readableDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

  if (!data && (loading || !error)) return <main className="page-shell"><div className="dashboard-main"><DashboardSkeleton /></div></main>;
  if (!data && error) return <main className="page-shell"><div className="dashboard-main error-panel"><div className="error-icon">!</div><h1>Unable to load your dashboard.</h1><p>We could not retrieve your latest leave information.</p><button className="primary-button" type="button" onClick={() => dispatch(fetchDashboard())}>Retry</button></div></main>;

  return (
    <main className="page-shell">
      <div className="dashboard-main">
        <header className="dashboard-heading"><div><p className="section-eyebrow">Overview</p><h1>{greeting}, {firstName}</h1><p>Here's your leave overview.</p></div><time dateTime={new Date().toISOString()}>{readableDate}</time></header>
        <section aria-labelledby="balances-title"><div className="section-heading compact"><div><p className="section-eyebrow">Time off</p><h2 id="balances-title">Leave balance</h2></div></div><div className="balance-grid">{data.leaveBalances.map((balance) => <LeaveBalanceCard key={balance.type} balance={balance} />)}</div></section>
        <section aria-labelledby="stats-title"><h2 className="visually-hidden" id="stats-title">Leave request statistics</h2><div className="stats-grid"><StatisticsCard label="Pending requests" value={data.statistics.pendingRequests} tone="pending" /><StatisticsCard label="Approved requests" value={data.statistics.approvedRequests} tone="approved" /><StatisticsCard label="Rejected requests" value={data.statistics.rejectedRequests} tone="rejected" /><StatisticsCard label="Upcoming leave days" value={data.statistics.upcomingLeaveDays} tone="upcoming" /></div></section>
        <div className="dashboard-columns"><UpcomingLeaves leaves={data.upcomingLeaves} /><RecentLeaveActivity activities={data.recentActivity} onViewAll={() => navigate('/my-leaves')} /></div>
      </div>
    </main>
  );
}

export default Dashboard;