function DashboardSkeleton() {
  return <div className="dashboard-skeleton" aria-label="Loading dashboard"><div className="skeleton-title" /><div className="skeleton-grid">{[1, 2, 3, 4].map((item) => <div className="skeleton-block" key={item} />)}</div><div className="skeleton-large" /></div>;
}

export default DashboardSkeleton;