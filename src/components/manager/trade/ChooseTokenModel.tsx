import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  Box,
  ModalProps,
  UseModalProps,
  Spacer,
} from "@chakra-ui/react";
import { Asset } from "types/asset";

interface Prop {
  asset: Asset[];
  isOpen: UseModalProps["isOpen"];
  onClose: UseModalProps["onClose"];
  chooseTokenButtonOnClick: Function;
}
export default function ChooseTokenModel(props: Prop) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select An Asset</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.asset.map((asset) => (
            <Box key={asset.address}>
              <Button
                key={asset.address}
                p={2}
                m={2}
                w="100%"
                onClick={() => {
                  props.chooseTokenButtonOnClick(asset);
                  props.onClose();
                }}
              >
                {asset.title}
                <Spacer />
                {Number(asset.balance).toFixed(2)}
              </Button>
            </Box>
          ))}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" p={2} m={2} w="100%">
            Managy Token
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
