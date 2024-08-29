import React from "react"
import {
  Text,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from "@chakra-ui/react"

export default function About() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      {/* <Button onClick={onOpen} colorScheme="orange">
        Learn More
      </Button> */}

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>TRENUTEK TIŠINE</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="md">
              Trenutek tišine je projekt za osveščanje ljudi o znakovnem jeziku, ki ga za komunikacijo večinoma uporabljajo osebe s težavami s sluhom.<br></br>
              Več kot 5 % svetovnega prebivalstva - ali 430 milijonov ljudi - potrebuje rehabilitacijo, da bi odpravili invalidnost zaradi izgube sluha (vključno s 34 milijoni otrok). Ocenjuje se, da bo do leta 2050 več kot 700 milijonov ljudi oziroma vsak deseti človek imel invalidno izgubo sluha. Vir: <Link
                href="https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss"
                isExternal
                color="orange.300"
              >
                Svetovna zdravstvena organizacija
              </Link><br></br>
              <br></br>
              
            </Text>
            <Image src="/ASL_Alphabet.jpg" alt="Enoročna znakovna abeceda" />
            <Text fontSize="sm">
              vir slike: https://kidcourses.com/asl-alphabet-handout/
            </Text>
            <Text fontSize="md">
              Za zaprtje modalnega okna z informacijami prikažite črko Y.
            </Text>
            {/* <Image src={handImages} /> */}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
