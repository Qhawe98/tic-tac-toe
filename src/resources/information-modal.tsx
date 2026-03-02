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

const InformationModal = ({ isOpen, onClose, title, message, width, onConfirmButtonText }: InformationModalProps) => {

    return (
        <>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: width || '450px' }}>
                        <h2>{title}</h2>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>

                        <div className="modal-buttons">
                            <button onClick={onClose}>
                                {onConfirmButtonText || "Start Main Game"}
                            </button>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
}

export default InformationModal;