function ConfirmationModal({ onConfirm, onClose, loading }) {
  return <div className="modal-backdrop" role="presentation"><section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">Cancel leave request?</h2><p>Are you sure you want to cancel this leave request?</p><div className="modal-actions"><button type="button" onClick={onClose} disabled={loading}>Keep request</button><button type="button" className="danger-button" onClick={onConfirm} disabled={loading}>{loading ? 'Cancelling...' : 'Cancel request'}</button></div></section></div>;
}
export default ConfirmationModal;
