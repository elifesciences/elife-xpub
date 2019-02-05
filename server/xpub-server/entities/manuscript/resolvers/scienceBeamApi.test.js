jest.mock('request-promise-native', () => ({
  post: (url, obj) => `
    <article article-type="research-article">
        <front>
          <article-meta>
            <title-group>
              <article-title>The Relationship Between Lamport Clocks and Interrupts Using Obi</article-title>
            </title-group>
            <contrib-group content-type="author">
              <contrib contrib-type="person">
                <name>
                  <surname>Dunaev</surname>
                  <given-names>Mihail</given-names>
                </name>
              </contrib>
              <contrib contrib-type="person">
                <name>
                  <surname>Spencer</surname>
                  <given-names>Jen</given-names>
                </name>
              </contrib>
            </contrib-group>
            <abstract>
                      <p>The implications of relational symmetries have been far-reaching and pervasive. In this work, we prove the understanding of lambda calculus , which embodies the practical principles of cryptography. We motivate a methodology for the construction of DNS (Obi), which we use to argue that the seminal real-time algorithm for the understanding of 802.11b follows a Zipf-like distribution.</p>
                  </abstract>
          </article-meta>
        </front>
        <body/>
        <back>
          <ref-list id="ref-list-1">
            <ref id="b0">
              <element-citation publication-type="journal">
                <article-title>BACE: Compact, game-theoretic algorithms</article-title>
                <year>2003</year>
                <month>03</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Backus</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>J</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Martin</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>S</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b1">
              <element-citation publication-type="journal">
                <article-title>The relationship between e-commerce and IPv7</article-title>
                <year>2002</year>
                <month>06</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Codd</given-names>
                  </name>
                  <name>
                    <surname>And Ito</surname>
                    <given-names>E</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>A</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b2">
              <element-citation publication-type="journal">
                <article-title>Decoupling model checking from RAID in wide-area networks</article-title>
                <year>2003</year>
                <month>06</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Gray</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>J</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b3">
              <element-citation publication-type="journal">
                <article-title>Evaluating the transistor and randomized algorithms</article-title>
                <year>1999</year>
                <month>07</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Hawking</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>S</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b4">
              <element-citation publication-type="journal">
                <article-title>Controlling model checking using peer-to-peer communication</article-title>
                <year>2002</year>
                <month>05</month>
                <person-group person-group-type="author">
                  <name>
                    <surname>Ito</surname>
                    <given-names>F</given-names>
                  </name>
                  <name>
                    <surname>Shenker</surname>
                    <given-names>S</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>Hartmanis</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>J</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b5">
              <element-citation publication-type="journal">
                <article-title>A refinement of neural networks</article-title>
                <year>2000</year>
                <month>06</month>
                <person-group person-group-type="author">
                  <name>
                    <surname>Ito</surname>
                    <given-names>Q</given-names>
                  </name>
                  <name>
                    <surname>Patterson</surname>
                    <given-names>D</given-names>
                  </name>
                  <name>
                    <surname>Wilson</surname>
                    <given-names>O</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>Johnson</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>B</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b6">
              <element-citation publication-type="journal">
                <article-title>Pervasive, virtual archetypes for Byzantine fault tolerance</article-title>
                <year>2003</year>
                <month>05</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Jackson</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>W</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Schroedinger</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>E</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b7">
              <element-citation publication-type="journal">
                <article-title>The relationship between the Internet and the lookaside buffer</article-title>
                <year>1995</year>
                <month>10</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Johnson</given-names>
                  </name>
                  <name>
                    <surname>Estrin</surname>
                    <given-names>I N</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>D</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Takahashi</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>T</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b8">
              <element-citation publication-type="journal">
                <article-title>A visualization of spreadsheets</article-title>
                <year>2005</year>
                <month>09</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Kaashoek</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>M F</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Brooks</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>R</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b9">
              <element-citation publication-type="journal">
                <article-title>The memory bus no longer considered harmful</article-title>
                <source>Journal of Authenticated</source>
                <year>2004</year>
                <month>10</month>
                <volume>8</volume>
                <fpage>77</fpage>
                <lpage>86</lpage>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Kaashoek</given-names>
                  </name>
                  <name>
                    <surname>Hopcroft</surname>
                    <given-names>M F</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>J</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Agarwal</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>R</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b10">
              <element-citation publication-type="journal">
                <article-title>A case for virtual machines</article-title>
                <year>2004</year>
                <month>12</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Lee</given-names>
                  </name>
                  <name>
                    <surname>Mccarthy</surname>
                    <given-names>C</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>J</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Robinson</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>L</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b11">
              <element-citation publication-type="journal">
                <article-title>A methodology for the synthesis of context-free grammar</article-title>
                <year>2003</year>
                <month>05</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Moore</given-names>
                  </name>
                  <name>
                    <surname>Garey</surname>
                    <given-names>T</given-names>
                  </name>
                  <name>
                    <surname>Bachman</surname>
                    <given-names>M</given-names>
                  </name>
                  <name>
                    <surname>Milner</surname>
                    <given-names>C</given-names>
                  </name>
                  <name>
                    <surname>Hawking</surname>
                    <given-names>R</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>S</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Kubiatowicz</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>J</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b12">
              <element-citation publication-type="journal">
                <article-title>Constructing compilers using low-energy modalities</article-title>
                <year>1994</year>
                <month>01</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Smith</given-names>
                  </name>
                  <name>
                    <surname>Kaashoek</surname>
                    <given-names>F</given-names>
                  </name>
                  <name>
                    <surname>Maruyama</surname>
                    <given-names>M F</given-names>
                  </name>
                  <name>
                    <surname>Miller</surname>
                    <given-names>L</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>E</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Minsky</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>M</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b13">
              <element-citation publication-type="journal">
                <article-title>Simulation of gigabit switches</article-title>
                <year>2005</year>
                <month>11</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Smith</given-names>
                  </name>
                  <name>
                    <surname>Componyhile</surname>
                    <given-names>J</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b14">
              <element-citation publication-type="journal">
                <article-title>Studying Smalltalk using stochastic epistemologies</article-title>
                <source>Journal of Stable Information</source>
                <year>1990</year>
                <month>12</month>
                <volume>9</volume>
                <fpage>85</fpage>
                <lpage>106</lpage>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Spencer</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>J</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b15">
              <element-citation publication-type="journal">
                <article-title>Towards the analysis of lambda calculus</article-title>
                <year>2003</year>
                <month>09</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Sutherland</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>I</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b16">
              <element-citation publication-type="journal">
                <article-title>Cache coherence considered harmful</article-title>
                <year>1996</year>
                <month>08</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Tarjan</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>R</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b17">
              <element-citation publication-type="journal">
                <article-title>The effect of low-energy information on autonomous cyberinformatics</article-title>
                <year>2005</year>
                <month>08</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Taylor</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>V</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b18">
              <element-citation publication-type="journal">
                <article-title>A visualization of the location-identity split with Charmer</article-title>
                <year>1993</year>
                <month>02</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>White</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>P</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b19">
              <element-citation publication-type="journal">
                <article-title>Introspective, robust configurations for fiber-optic cables</article-title>
                <year>2005</year>
                <month>10</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Wilkinson</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>J</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
            <ref id="b20">
              <element-citation publication-type="journal">
                <article-title>A synthesis of replication</article-title>
                <year>1998</year>
                <month>09</month>
                <person-group person-group-type="author">
                  <name>
                    <surname/>
                    <given-names>Wirth</given-names>
                  </name>
                  <name>
                    <surname>Zhao</surname>
                    <given-names>N</given-names>
                  </name>
                  <name>
                    <surname>Wu</surname>
                    <given-names>V R</given-names>
                  </name>
                  <name>
                    <surname>Wilson</surname>
                    <given-names>A</given-names>
                  </name>
                  <name>
                    <surname>Wilkinson</surname>
                    <given-names>X S</given-names>
                  </name>
                  <name>
                    <surname>Hawking</surname>
                    <given-names>J</given-names>
                  </name>
                  <name>
                    <surname>Thompson</surname>
                    <given-names>S</given-names>
                  </name>
                  <name>
                    <surname>And</surname>
                    <given-names>K</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>Hamming</given-names>
                  </name>
                  <name>
                    <surname/>
                    <given-names>R</given-names>
                  </name>
                </person-group>
              </element-citation>
            </ref>
          </ref-list>
        </back>
      </article>`,
}))

require('request-promise-native')
const { extractSemantics } = require('./scienceBeamApi')

describe('scienceBeamApi', () => {
  it('extracts correct data', () => {
    const title = extractSemantics({}, '', '', '')

    expect(title).toBe(
      'The Relationship Between Lamport Clocks and Interrupts Using Obi',
    )
  })
})
