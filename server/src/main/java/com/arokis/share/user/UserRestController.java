package com.arokis.share.user;

import com.arokis.general.controller.UpdateBaseController;
import com.arokis.general.exception.ErrorResponse;
import com.arokis.general.json.ResponseJson;
import com.arokis.share.user.model.User;
import com.arokis.share.user.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Validated
@RestController
public class UserRestController extends UpdateBaseController<User> {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<User> getAllUser(Pageable pageable) {
        Page<User> all = userRepository.findAll(pageable);
        return all.getContent();
    }

    @RequestMapping(value = "/api/signup2", method = RequestMethod.POST)
    public ResponseEntity saveUser2(@Valid @RequestBody User user, Errors errors) {
        ResponseJson response = new ResponseJson();
        try {
            userRepository.save(user);
            response.setSuccess(true);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            ErrorResponse errorResponse = new ErrorResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage(ex.getMessage());
            return new ResponseEntity<ErrorResponse>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<ResponseJson>(response, HttpStatus.OK);
    }

    private void validate() {

    }
}
