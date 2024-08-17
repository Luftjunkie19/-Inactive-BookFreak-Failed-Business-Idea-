import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'

type Props = {
    isOpen: boolean,
    modalTitle?: string,
    modalBodyContent?: React.ReactNode,
    modalFooterContent?: React.ReactNode,
    onOpenChange:(isOpen?: boolean)=>void,
}

function ModalComponent({isOpen,onOpenChange,modalTitle, modalBodyContent, modalFooterContent }: Props) {
  return (
    <Modal backdrop='blur' classNames={{
      'base': 'bg-dark-gray border border-primary-color',
      closeButton:"hover:bg-red-500 transition-all duration-400 hover:text-white"
    }} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
                      <ModalHeader className="flex flex-col gap-1 text-white">{modalTitle}</ModalHeader>
              <ModalBody>
               {modalBodyContent}
              </ModalBody>
              <ModalFooter>
                {modalFooterContent}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default ModalComponent