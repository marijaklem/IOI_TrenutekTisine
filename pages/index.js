import React, { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam"
import { drawHand } from "../components/handposeutil"
import * as fp from "fingerpose"
import Handsigns from "../components/handsigns"

import {
  Text,
  Heading,
  Button,
  Image,
  Stack,
  Container,
  Box,
  VStack,
  ChakraProvider,
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

// import { Signimage, Signpass } from "../components/handimage"
import { Signpass } from "../components/znaki"

import About from "../components/about"
import Metatags from "../components/metatags"

import { RiCameraFill, RiCameraOffFill } from "react-icons/ri"

export default function Home() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [camState, setCamState] = useState("on")

  const [sign, setSign] = useState(null)

  let signList = []
  let currentSign = 0

  let gamestate = "started"

  async function runHandpose() {
    const net = await handpose.load()
    _signList()

    setInterval(() => {
      detect(net)
    }, 150)
  }

  function _signList() {
    signList = generateSigns()
  }

  let word = "";

  function generateSigns() {
    const letters = {
      "A": 0,
      "B": 1,
      "C": 2,
      "D": 3,
      "E": 4,
      "F": 5,
      "G": 6,
      "H": 7,
      "I": 8,
      "J": 9,
      "K": 10,
      "L": 11,
      "M": 12,
      "N": 13,
      "O": 14,
      "P": 15,
      "R": 17,
      "S": 18,
      "T": 19,
      "U": 20,
      "V": 21,
      "Z": 25
    }
    let words = ["KLAVIR", "PRIJATELJ", "ROKA"]
    word = words[Math.floor(Math.random() * words.length)];
    let signs = [];
    for (var i = 0; i < word.length; i++) {
      signs.push(Signpass[letters[word.charAt(i)]]);
    }
    return signs;
  }

  async function detect(net) {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      const hand = await net.estimateHands(video)

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.ThumbsUpGesture,
          Handsigns.aSign,
          Handsigns.bSign,
          Handsigns.cSign,
          Handsigns.dSign,
          Handsigns.eSign,
          Handsigns.fSign,
          Handsigns.gSign,
          Handsigns.hSign,
          Handsigns.iSign,
          Handsigns.jSign,
          Handsigns.kSign,
          Handsigns.lSign,
          Handsigns.mSign,
          Handsigns.nSign,
          Handsigns.oSign,
          Handsigns.pSign,
          Handsigns.rSign,
          Handsigns.sSign,
          Handsigns.tSign,
          Handsigns.uSign,
          Handsigns.vSign,
          Handsigns.wSign,
          Handsigns.ySign,
          Handsigns.zSign,
        ])

        const estimatedGestures = await GE.estimate(hand[0].landmarks, 6.5)

        if (gamestate === "started") {
          document.querySelector("#app-title").innerHTML =
            'Če si pripravljen na črkovanje besede, dvigni palec. <img src="/thumb.png" alt="Thumbs Up" style="width: 30px; height: 30px; vertical-align: middle; display: inline-block;" />';
        }

        if (
          estimatedGestures.gestures !== undefined &&
          estimatedGestures.gestures.length > 0
        ) {
          const confidence = estimatedGestures.gestures.map(p => p.confidence)
          const maxConfidence = confidence.indexOf(
            Math.max.apply(undefined, confidence)
          )

          if (estimatedGestures.gestures[maxConfidence].name === "W") {
            onOpen();
          }
          if (estimatedGestures.gestures[maxConfidence].name === "Y") {
            onClose();
          }
          console.log(estimatedGestures.gestures[maxConfidence].name);

          if (
            estimatedGestures.gestures[maxConfidence].name === "thumbs_up" &&
            gamestate !== "played"
          ) {
            _signList()
            gamestate = "played"
            document.getElementById("emojimage").classList.add("play")
            document.querySelector(".tutor-text").innerText =
              "Prikaži črko, kot prikazuje skica. Izpisali bomo besedo: " + word;
          } else if (gamestate === "played") {
            document.querySelector("#app-title").innerText = ""

            if (currentSign === signList.length) {
              signList = [];
              currentSign = 0
              gamestate = "started";
              document.querySelector(".tutor-text").innerText = "";
              document.getElementById("emojimage").classList.remove("play")
              return
            }

            if (
              typeof signList[currentSign].src.src === "string" ||
              signList[currentSign].src.src instanceof String
            ) {
              document
                .getElementById("emojimage")
                .setAttribute("src", signList[currentSign].src.src)
              if (
                signList[currentSign].alt ===
                estimatedGestures.gestures[maxConfidence].name
              ) {
                currentSign++
              }
              setSign(estimatedGestures.gestures[maxConfidence].name)
            }
          } else if (gamestate === "finished") {
            return
          }
        }
      }

      const ctx = canvasRef.current.getContext("2d")
      drawHand(hand, ctx)
    }
  }

  useEffect(() => {
    runHandpose()
  }, [])

  function turnOffCamera() {
    if (camState === "on") {
      setCamState("off")
    } else {
      setCamState("on")
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ChakraProvider>
      <Metatags />
      <Box bgColor="#777777">
        <Container centerContent maxW="xl" height="100vh" pt="0" pb="0">
          <VStack spacing={4} align="center">
            <Box h="20px"></Box>
            <Heading
              as="h3"
              size="lg"
              className="tutor-text"
              color="white"
              textAlign="center"
              textShadow="0px 0px 2px black"
            ></Heading>
            
            <Box h="20px"></Box>
          </VStack>

          <Heading
              as="h3"
              size="md"
              className="tutor-word"
              color="white"
              textAlign="center"
              textShadow="0px 0px 2px black"
            >
          </Heading>

          <Heading
            as="h1"
            size="lg"
            id="app-title"
            color="white"
            textAlign="center"
            textShadow="0px 0px 2px black"
          >
            Prosimo, počakajte
          </Heading>

          <Box id="webcam-container">
            {camState === "on" ? (
              <Webcam id="webcam" ref={webcamRef} />
            ) : (
              <div id="webcam" background="black"></div>
            )}

            {sign ? (
              <div
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  right: "calc(50% - 50px)",
                  bottom: 100,
                  textAlign: "-webkit-center",
                }}
              >
                <Text color="white" fontSize="md" mb={1}>
                  Trenutni zaznani znak:
                </Text>
                {(sign.length == 1) ? 
                (<Text color="white" fontSize="3xl" fontWeight="bold" mb={1}>
                  {sign}
                </Text>):
                (<img
                  alt="signImage"
                  src="/thumbup.png"
                  style={{
                    height: 30,
                  }}
                />)}
              </div>
            ) : (
              " "
            )}
          </Box>

          <canvas id="gesture-canvas" ref={canvasRef} style={{}} />

          <Box
            id="singmoji"
            style={{
              zIndex: 9,
              position: "fixed",
              top: "50px",
              right: "30px",
            }}
          ></Box>

          <Image h="150px" objectFit="cover" id="emojimage" />
        </Container>

        <Stack id="start-button" spacing={4} direction="row" align="center">
          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>TRENUTEK TIŠINE</ModalHeader>
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
                <Text fontSize="md" fontWeight="bold">
                  Za zaprtje modalnega okna z informacijami prikažite črko Y.
                </Text>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Stack>
        <Image
          src="/logo.png"
          alt="Logo"
          position="fixed"
          bottom="25px"
          right="35px"
          width="100px"
          height="auto"
        />      
        <Image
          src="/moreInfoVecja.png"
          alt="moreInfo"
          position="fixed"
          top="30px"
          left="35px"
          width="200px"
          height="auto"
        />
      </Box>
    </ChakraProvider>
  )
}
