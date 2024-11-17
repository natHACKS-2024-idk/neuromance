import json
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Individual
from .serializers import IndividualSerializer, BrainwaveDataSerializer
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
import numpy as np
import pandas as pd
from scipy.signal import hilbert, butter, filtfilt
import pywt
from .models import Individual, BrainwaveData
from .serializers import IndividualSerializer, BrainwaveDataSerializer

def index(request):
    return HttpResponse("Hello, world.")

def get_individuals_with_brainwave_data():
    # Fetch all individuals from the database
    individuals = Individual.objects.all()

    # Initialize a dictionary to store the data
    individuals_data = {}

    # Loop through each individual and fetch their brainwave data
    for individual in individuals:
        # Serialize the individual data
        individual_data = IndividualSerializer(individual).data

        # Fetch associated brainwave data for the individual
        brainwave_data = individual.brainwave_data.all()

        # Serialize the brainwave data
        brainwave_data_serialized = BrainwaveDataSerializer(brainwave_data, many=True).data

        # Add the brainwave data to the individual's data
        individual_data['brainwave_data'] = brainwave_data_serialized

        # Add the individual data to the dictionary
        individuals_data[individual.id] = individual_data

    return individuals_data

class MatchmakingView(APIView):
    def get(self, request):
        #print("request: ", request.data)
        # Parse the JSON body of the request
       # Access the parsed JSON data directly from request.data
        user_id = request.data.get('userId')  # Get the 'userID' attribute from the parsed JSON
        #print("user id: ", user_id)

        # Retrieve the individual object by ID
        user1 = get_object_or_404(Individual, id=user_id)
        #print("username: ", user1.firstName)

        # Retrieve the brainwave data for user1 (this will be df1)
        brainwave_data_user1 = request.data.get('recordings')
        #print("data1: ", brainwave_data_user1)

        # Convert brainwave data to a DataFrame for user1 (df1)
        df1_data = {
            'time': [data['timestamp'] for data in brainwave_data_user1],  # Use the 'timestamp' key instead of 'time'
            'AF7': [data['AF7'] for data in brainwave_data_user1],  # Use the 'AF7' key
            'AF8': [data['AF8'] for data in brainwave_data_user1],  # Use the 'AF8' key
        }
        df1 = pd.DataFrame(df1_data)
        print("df1: ", df1)

        # Fetch all other individuals' data
        all_data = get_individuals_with_brainwave_data()
        print("all_data: ", all_data)
        print("\n")

        comparisons = []

        # Loop through all individuals (excluding user1) and compare their brainwave data with user1's data
        for individual_id, individual_data in all_data.items():
            print("individual_id: ", individual_id)
            print("\n")
            print("sent ID: ", request.data.get('userId'))
            print("\n")
            print("individual_data: ", individual_data)
            print("\n")
            print("all_data.items: ", all_data.items())
            print("\n")
            print(str(individual_id) == str(request.data.get('userId')))
            print("\n")
            if str(individual_id) == str(request.data.get('userId')):
                print("skipped")
                continue  # Skip the comparison with user1

            # Retrieve the brainwave data of the other individual (df2)
            df2 = individual_data['brainwave_data']
            print("df2: ", df2)

            # Convert df2 into a DataFrame
            df2 = pd.DataFrame(df2)
            print("df2: ", df2)
            print("df1: ", df1)

            # Ensure both DataFrames have the same length
            min_length = min(len(df1), len(df2))
            df1 = df1.iloc[:min_length]
            df2 = df2.iloc[:min_length]

            df2.rename(columns={'af7': 'AF7', 'af8': 'AF8'}, inplace=True)
            print("2df2: ", df2)
            print("2df1: ", df1)

            # Now both df1 and df2 are of the same length
            eeg_signal_AF7_1 = df1['AF7'].values
            eeg_signal_AF7_2 = df2['AF7'].values  # Ensure column names match (case-sensitive)

            # Sampling rate (Hz)
            sampling_rate = 1000

            # Apply bandpass filter to both signals
            filtered_signal_1 = self.bandpass_filter(eeg_signal_AF7_1, 8, 13, sampling_rate)
            filtered_signal_2 = self.bandpass_filter(eeg_signal_AF7_2, 8, 13, sampling_rate)

            # Apply wavelet denoising to both signals
            denoised_signal_1 = self.wavelet_denoising(filtered_signal_1)
            denoised_signal_2 = self.wavelet_denoising(filtered_signal_2)

            # Compute PLI between df1 and df2
            average_pli = self.compute_epoch_based_pli(denoised_signal_1, denoised_signal_2, 0.04, sampling_rate)

            comparisons.append({
                'individual_id': individual_id,
                'PLI': average_pli
            })

        # Sort the comparisons by PLI in descending order
        sorted_comparisons = sorted(comparisons, key=lambda x: float(x['PLI']), reverse=True)

        # Return the comparisons as a JSON response
        return JsonResponse({'comparisons': sorted_comparisons}, status=200)

    def bandpass_filter(self, data, lowcut, highcut, fs, order=5):
        """
        Apply a bandpass filter to the data.
        """
        if len(data) <= 33:
            print("Warning: Signal too short for filtering.")
            return data  # Return the signal without filtering if it's too short

        nyquist = 0.5 * fs
        low = lowcut / nyquist
        high = highcut / nyquist
        b, a = butter(order, [low, high], btype='band')
        
        try:
            return filtfilt(b, a, data)
        except ValueError as e:
            print(f"Error in bandpass filtering: {e}")
            return data  # Return the signal without filtering in case of an error

    def wavelet_denoising(self, signal, wavelet='db4', level=4, threshold_factor=2.0):
        """
        Apply wavelet denoising to the signal.
        """
        # Get the maximum possible level of decomposition for the given signal length
        max_level = pywt.dwt_max_level(len(signal), wavelet)

        # Adjust the level to be within the maximum possible level
        level = min(level, max_level)

        # Perform wavelet decomposition
        coeffs = pywt.wavedec(signal, wavelet, mode='symmetric', level=level)

        # Calculate threshold based on the specified threshold factor
        threshold = threshold_factor * np.sqrt(2 * np.log(len(signal))) * np.median(np.abs(coeffs[-level])) / 0.6745

        # Apply soft thresholding to the wavelet coefficients
        denoised_coeffs = [pywt.threshold(c, threshold, mode='soft') for c in coeffs]

        # Reconstruct the signal from the denoised coefficients
        return pywt.waverec(denoised_coeffs, wavelet)

    def compute_epoch_based_pli(self, signal_1, signal_2, epoch_length, fs):
        """
        Compute the Phase Lag Index (PLI) over multiple epochs.
        """
        epoch_samples = int(epoch_length * fs)
        num_epochs = len(signal_1) // epoch_samples

        # Skip processing if there isn't enough data for even one epoch
        if num_epochs == 0:
            print("Skipping: Signal too short to create epochs.")
            return None  # Or return a default value, like 0 or -1

        pli_values = []

        # Loop over each epoch
        for epoch_idx in range(num_epochs):
            start = epoch_idx * epoch_samples
            end = start + epoch_samples

            # Extract the signals for the current epoch
            epoch_signal_1 = signal_1[start:end]
            epoch_signal_2 = signal_2[start:end]

            # Apply Hilbert transform to get phase information
            analytic_signal_1 = hilbert(epoch_signal_1)
            analytic_signal_2 = hilbert(epoch_signal_2)
            phase_1 = np.angle(analytic_signal_1)
            phase_2 = np.angle(analytic_signal_2)

            # Compute phase difference
            phase_diff = phase_1 - phase_2

            # Compute the sign of the phase difference
            sign_phase_diff = np.sign(phase_diff)

            # Calculate the PLI for the current epoch
            pli = np.abs(np.mean(sign_phase_diff))
            pli_values.append(pli)

        # Compute the average PLI across all epochs
        if pli_values:
            average_pli = np.mean(pli_values)
            return "{:.3f}".format(average_pli)
        else:
            print("Warning: No valid epochs were processed.")
            return None

    
class Register(APIView):
    """
    POST individual user data
    path: /api/register/
    
    Example POST data:
    {
        "firstName": "John",
        "lastName": "Doe",
        "email": "
        "age": 25,
        "password": "password"
    }
    """
    def post(self, request):
        serializer = IndividualSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class GetUser(APIView):
    """
    GET individual user data by UUID
    path: /api/users/<uuid:uuid>/
    """
    def get(self, request, uuid):
        user = get_object_or_404(Individual, id=uuid)
        serializer = IndividualSerializer(user)
        return Response(serializer.data, status=200)
    
class SaveBrainwaveData(APIView):
    """
    POST brainwave data for a specific user
    """
    def post(self, request, uuid):
        # Get the user (Individual) by UUID
        user = get_object_or_404(Individual, id=uuid)

        # Extract the recordings list from the request data
        recordings = request.data.get('recordings', [])

        # Validate and save each recording
        saved_data = []
        for recording in recordings:
            # Prepare the data for the serializer (convert field names to match model fields)
            recording_data = {
                "time": recording["timestamp"],
                "af7": recording["AF7"],
                "af8": recording["AF8"]
            }

            # Serialize each recording
            serializer = BrainwaveDataSerializer(data=recording_data)
            if serializer.is_valid():
                # Save each valid recording, associating it with the user (individual)
                serializer.save(individual=user)
                saved_data.append(serializer.data)
            else:
                # If any of the recordings are invalid, return errors
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # If all recordings are saved successfully, return the saved data
        return Response(saved_data, status=status.HTTP_201_CREATED)