Feature: User Login


  Background:
    Given a registered user exists with username "validUser" and password "validPass"
    And a locked user exists with username "lockedUser" and password "anyPass"

  Scenario Outline: User attempts to log in
    When the user attempts to log in with username "<username>" and password "<password>"
    Then the user should see "<message>"

    Examples:
      | username    | password    | message                                         |
      | validUser   | validPass   | Products page is displayed                      |
      |             | validPass   | Username is required                            |
      | validUser   |             | Password is required                            |
      | lockedUser  | anyPass     | Sorry, this user has been locked out.           |
      | invalidUser | invalidPass | Username and password do not match              |
      | validUser   | wrongPass   | Username and password do not match              |
      | wrongUser   | validPass   | Username and password do not match              |