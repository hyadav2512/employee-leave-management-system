import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { fetchLeaveInfo } from '../../store/slices/leaveSlice';
import { fetchLeaveRequests } from '../../store/slices/leaveSlice';
import LeaveFilters from './LeaveFilters';
import LeaveTable from './LeaveTable';
import Pagination from '../shared/Pagination';
import './MyLeaves.css';

const defaults = { page: '1', limit: '10', search: '', status: '', leaveType: '', startDate: '', endDate: '', sortBy: 'createdAt', sortOrder: 'desc' };

function MyLeaves() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { requests, pagination, types, loading, error } = useSelector((state) => state.leave);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const filters = { ...defaults, ...Object.fromEntries(searchParams.entries()), search };

  useEffect(() => { if (!types.length) dispatch(fetchLeaveInfo()); }, [dispatch, types.length]);
  useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);
  useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search), 400); return () => window.clearTimeout(timer); }, [search]);
  useEffect(() => {
    const next = { ...filters, search: debouncedSearch };
    setSearchParams(Object.entries(next).filter(([, value]) => value).reduce((params, [key, value]) => { params.set(key, value); return params; }, new URLSearchParams()), { replace: true });
    dispatch(fetchLeaveRequests(next));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, searchParams.get('status'), searchParams.get('leaveType'), searchParams.get('startDate'), searchParams.get('endDate'), searchParams.get('sortBy'), searchParams.get('sortOrder'), searchParams.get('page')]);

  const changeFilter = (name, value) => {
    if (name === 'search') { setSearch(value); return; }
    const next = new URLSearchParams(searchParams);
    next.set(name, value);
    next.set('page', '1');
    setSearchParams(next);
  };
  const clearFilters = () => { setSearch(''); setSearchParams({ page: '1' }); };
  const changePage = (page) => { const next = new URLSearchParams(searchParams); next.set('page', String(page)); setSearchParams(next); };

  const hasFilters = Object.entries(filters).some(([key, value]) => value && !['page', 'limit', 'sortBy', 'sortOrder'].includes(key));
  return <main className="page-shell my-leaves-page"><header className="my-leaves-heading"><div><p className="section-eyebrow">Your time away</p><h1>My leave requests</h1><p>Review the requests you have submitted.</p></div><Link className="apply-primary" to="/apply-leave">Apply for leave</Link></header>{location.state?.notification && <div className="apply-success" role="status">{location.state.notification}</div>}<LeaveFilters filters={filters} types={types} onChange={changeFilter} onClear={clearFilters} />{error && <div className="list-error" role="alert"><span>Unable to load your leave requests.</span><button type="button" onClick={() => dispatch(fetchLeaveRequests(filters))}>Retry</button></div>}{!loading && !requests.length && <div className="empty-leaves"><h2>{hasFilters ? 'No matching leave requests found.' : 'No leave requests found.'}</h2><p>{hasFilters ? 'Try changing your filters.' : "You haven't submitted any leave requests yet."}</p>{hasFilters ? <button type="button" onClick={clearFilters}>Clear filters</button> : <Link to="/apply-leave">Apply for leave</Link>}</div>}{(loading || requests.length > 0) && <><LeaveTable requests={requests} loading={loading} /><div className="table-footer"><span>{pagination.total} request{pagination.total === 1 ? '' : 's'}</span><Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={changePage} /></div></>}</main>;
}
export default MyLeaves;
