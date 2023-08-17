import {
  Text,
  Container,
  Anchor,
  MediaQuery,
  Button,
  Image,
  Box,
} from "@mantine/core";
import { MdOutlineArrowDownward } from "react-icons/md";
import { Link } from 'react-scroll';

const About = () => {
    //const theme = useMantineTheme();

    return (
      <section id="about">
        <Container fluid sx={{ marginTop: 0 }}>
          <div className="about-content">
            <div className="content">
              <div style={{ marginBottom: 15, padding: 5, fontSize: 32 }}>
                <Text weight={500} color="grey" size={"xxl"}>
                  From Freelancer to Cryptopreneur <br /> Your Journey Starts
                  Here.
                </Text>
              </div>

              <div style={{ marginBottom: 25, padding: 10, color: "grey" }}>
                <Text size="" color="black">
                  Welcome to the world of crypto freelancing!
                  <br /> Whether you're a developer, designer, writer, <br /> or
                  marketer, the crypto space
                  <br />
                  offers exciting opportunities to leverage your
                  <br /> skills and
                  <Anchor href="/"> earn</Anchor>. in
                  cryptocurrencies.{" "}
                </Text>
              </div>

              <div className="buttons">
                <Link to="section-one" smooth duration={500}>
                  <Button
                    color="skyblue"
                    rightIcon={<MdOutlineArrowDownward size={16} />}
                    radius="lg"
                    size="md"
                  >
                    more
                  </Button>
                </Link>

                <Button variant="default" radius="lg" size="md">
                  Explore
                </Button>
              </div>
            </div>
            <div className="image">
              <Image
                maw={440}
                mx="auto"
                radius="md"
                src="https://res.cloudinary.com/dufdzujik/image/upload/v1692306579/FUN_FOOD/12832654_5097611-removebg-preview_vpi0hp.png"
                alt="Random image"
              />
            </div>
          </div>
        </Container>
      </section>
    );
};

export default About;