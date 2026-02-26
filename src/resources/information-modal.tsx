import '../App.css';

type InformationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    htmlElement?: React.ReactNode;
    width?: number;
    onCloseButtonText?: string;
    onConfirmButtonText?: string;
    onCancelButtonText?: string;
}

const InformationModal = ({ isOpen, onClose, title, message, onConfirm, onCancel, htmlElement, width, onCloseButtonText, onConfirmButtonText, onCancelButtonText }: InformationModalProps) => {

    return (
        <>
            {isOpen && (
                <div className="modal-overlay" onClick={onClose}>
                    <div className="modal-content" style={{ width: width || '50vmin' }} onClick={(e) => e.stopPropagation()}>
                        <h2>{title}</h2>
                        {htmlElement && htmlElement}
                        <p>{message}</p>
                        <div className="modal-buttons">
                            {onConfirm && <button onClick={onConfirm}>{onConfirmButtonText || "Confirm"}</button>}
                            {onCancel && <button onClick={onCancel}>{onCancelButtonText || "Cancel"}</button>}
                            {!onConfirm && !onCancel && <button onClick={onClose}>{onCloseButtonText || "Ok"}</button>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default InformationModal;