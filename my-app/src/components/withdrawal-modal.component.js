import { React, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormLabel,
  Input,
  useDisclosure
} from '@chakra-ui/react'

function WithdrawalModal(props) {
    const [ptosToWithdraw, setPtosToWithdraw] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>Withdraw</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Withdrawal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel htmlFor='ptosToWithdraw'>PTOs to Withdraw</FormLabel>
              <Input id='ptosToWithdraw' type='text' required value={ptosToWithdraw} onChange={(e) => setPtosToWithdraw(e.target.value)} />
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
              <Button variant='ghost' onClick={() => props.burnPto(ptosToWithdraw, props.incPendingTxs, props.decPendingTxs)}>Withdraw</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
export default WithdrawalModal;