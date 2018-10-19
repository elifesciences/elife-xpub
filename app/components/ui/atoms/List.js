import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { List } from 'react-feather'

const StyledUnorderedList = styled.ul`
  margin-left: 0;
  padding-left: 0;

  > li:before {
    /* Position and style the box around the bullet */
    position: absolute;
    left: -${th('space.3')};
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: ${th('space.3')};

    /* font of number or bullet */
    color: ${th('colorText')};
    font-family: inherit;
    font-size: inherit;
    text-align: center;
  }

  > li {
    position: relative;

    /* Spacing between list items */
    margin-bottom: ${th('space.3')};

    /* Give each list item a left margin to make room for the bullets */
    margin-left: ${th('space.3')};

    /* Moves text slightly further away from the number, bringing the total space closer to 12px  */
    padding-left: ${th('space.1')};
  }

  > li:last-child {
    margin-bottom: 0;
  }
`

const StyledOrderedList = styled.ol`
  /* ol itself - initiate a counter & remove default margin & padding */
  counter-reset: li;
  margin-left: 0;
  padding-left: 0;

  /* Numbering & box around number */

  > li:before {
    content: counter(li) '.'; /* Use the counter + a full stop as the content */
    counter-increment: li; /* Increment the counter by 1 */

    /* Position and style the box around the number/bullet */
    position: absolute;
    left: -${th('space.3')};
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: ${th('space.3')};

    /* font of number or bullet */
    color: ${th('colorText')};
    font-family: inherit;
    font-size: inherit;
    text-align: center;
  }

  > li {
    list-style: none; /* Disable the normal item numbering */
    position: relative;

    /* Spacing between list items */
    margin-bottom: ${th('space.3')};

    /* Give each list item a left margin to make room for the numbers */
    margin-left: ${th('space.3')};

    /* Moves text slightly further away from the number, bringing the total space closer to 12px  */
    padding-left: ${th('space.1')};
  }

  > li:last-child {
    margin-bottom: 0;
  }
`

List.Ordered = StyledOrderedList
List.Unordered = StyledUnorderedList

export default List
