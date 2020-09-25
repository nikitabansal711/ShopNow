import React from 'react';
import {Button, List} from "semantic-ui-react";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <List divided horizontal>
          {pageNumbers.map(number => (
              <List.Item>
                <List.Content>
                  <Button onClick={() => paginate(number)}>
                    {number}
                  </Button>
                </List.Content>
            </List.Item>
          ))}
       </List>
    </nav>
  );
};

export default Pagination;