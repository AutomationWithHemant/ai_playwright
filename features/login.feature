Feature: User Login

  Background:
    Given a registered user exists with username "validUser" and password "validPassword"
    And a locked user exists with username "lockedUser" and password "anyPassword"

  Scenario Outline: User attempts to log in
    When the user attempts to log in with username "<username>" and password "<password>"
    Then the user should see "<message>"

    Examples:
      | username     | password      | message                                           |
      | validUser    | validPassword | User lands on the Products page                   |
      |              | validPassword | Username is required                              |
      | validUser    |               | Password is required                              |
      | lockedUser   | anyPassword   | Sorry, this user has been locked out.             |
      | invalidUser  | validPassword | Username and password do not match                |
      | validUser    | wrongPassword | Username and password do not match                |
