function FileUpload({ file, onChange }) {
  return (
    <div className="apply-field">
      <label htmlFor="attachment">Attachment <span className="optional-label">Optional</span></label>
      <input id="attachment" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={onChange} />
      {file && <p className="file-name">Selected: {file.name}</p>}
    </div>
  );
}

export default FileUpload;
