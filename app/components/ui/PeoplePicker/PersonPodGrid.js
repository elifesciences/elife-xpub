import React from 'react'
// import PropTypes from 'prop-types'

// import { peoplePropType } from './types'
// import TwoColumnLayout from '../../global/layout/TwoColumnLayout'
import PersonPod from './PersonPod'

// const MAX_DISPLAYED_PODS = 30

// const PersonPodGrid = ({
//   people,
//   isSelected,
//   toggleSelection,
//   selection,
//   maxSelection,
//   ...props
// }) => (
  
// )
class PersonPodGrid extends React.Component {

  constructor(props) {
    super(props);

    // Sets up our initial state
    this.state = {
      hasMore: true,
      isLoading: false,
      windowPeople: [],
      lastIndex: 0
    };
  }
    // Binds our scroll event handler
  //   window.onscroll = () => {
  //     const {
  //       loadPeople,
  //       state: {
  //         error,
  //         isLoading,
  //         hasMore,
  //       },
  //     } = this;

  //     console.log('scrolling!!!!!')
  //     // Bails early if:
  //     // * there's an error
  //     // * it's already loading
  //     // * there's nothing left to load
  //     // if (error || isLoading || !hasMore) return;

  //     // Checks that the page has scrolled to the bottom
  //     if (
  //       window.innerHeight + document.documentElement.scrollTop
  //       === document.documentElement.offsetHeight
  //     ) {
  //       loadPeople();
  //     }
  //   };
  // }


  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
      console.log('111111111')
      console.log(event)
      const { scrollTop } = event.srcElement.body
      const itemTranslate = Math.min(0, scrollTop/3 - 60);
      console.log('scrolling', itemTranslate)

      // this.setState({
      //   transform: itemTranslate
      // });
  }


  loadPeople = () => {
    // this.setState({ isLoading: true }, () => {
      
    // });
    // console.log('********', this.state.windowPeople)
    console.log('scroll')
    this.setState({
      // Note: Depending on the API you're using, this value may
      // be returned as part of the payload to indicate that there
      // is no additional data to be loaded
      // hasMore: true,  // (this.state.windowPeople.length < this.props.people),
      // isLoading: false,
      // windowPeople: [
      //   ...this.state.windowPeople,
      // ],
      lastIndex: this.state.lastIndex + 10
    });
  }


  render() {
    const {
      error,
      hasMore,
      isLoading,
      windowPeople,
      lastIndex
    } = this.state;
    
    const { isSelected, selection, maxSelection, toggleSelection } = this.props 

    return (
      <div
        onScroll={this.handleScroll}
        ref={(scroller) => {
          this.scroller = scroller;
        }}
      >
        <h1>Infinite Users!</h1>
        <p>Scroll down to load more!!</p>
        {this.props.people.slice(lastIndex,lastIndex+10).map(person => (
          <PersonPod
            expertises={person.expertises}
            focuses={person.focuses}
            institution={person.aff}
            isKeywordClickable={false}
            isSelectButtonClickable={
              isSelected(person) || selection.length < maxSelection
            }
          isSelected={isSelected(person)}
          key={person.id}
          name={person.name}
          selectButtonType={isSelected(person) ? 'selected' : 'add'}
          togglePersonSelection={() => toggleSelection(person)}
          // onKeywordClick will need to be added, once we know what the desired behaviour is
        />
        ))}
        <hr />
        {error &&
          <div style={{ color: '#900' }}>
            {error}
          </div>
        }
        {isLoading &&
          <div>Loading...</div>
        }
        {!hasMore &&
          <div>You did it! You reached the end!</div>
        }
      </div>
    );
  }
}

// PersonPodGrid.propTypes = {
//   people: peoplePropType.isRequired,
//   isSelected: PropTypes.func.isRequired,
//   toggleSelection: PropTypes.func.isRequired,
//   selection: peoplePropType.isRequired,
//   maxSelection: PropTypes.number,
// }

// PersonPodGrid.defaultProps = {
//   maxSelection: Infinity,
// }

export default PersonPodGrid
