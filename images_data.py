from csv import reader
import json
import os
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

def csv_to_item_table(file_name1, file_name2, file_name3):
    data = []
    with open(file_name1, 'r') as csv_file:
        csv_data = list(reader(csv_file))
        for row in csv_data[1:]:
            record = defaultdict(dict)
            record['model'] = 'core.Item'
            record['pk'] = row[0]
            record['fields']['title'] = row[1]
            record['fields']['price'] = row[2]
            record['fields']['category'] = row[3]
            record['fields']['label'] = row[4]
            record['fields']['slug'] = row[5]
            record['fields']['description'] = row[6]
            record['fields']['image'] = 'images/' + row[7] + '.jpg'
            data.append(record)

    with open(file_name2, 'r') as csv_file:
        csv_data = list(reader(csv_file))
        for row in csv_data[1:]:
            record = defaultdict(dict)
            record['model'] = 'core.ItemVariation'
            record['pk'] = row[0]
            record['fields']['variation'] = row[1]
            record['fields']['value'] = row[3]
            record['fields']['attachment'] = row[4]
            data.append(record)
    
    for id in range(1,71):
        record = defaultdict(dict)
        record['model'] = 'core.Variation'
        record['fields']['item'] = id
        record['pk'] = id
        record['fields']['name'] = 'color'
        data.append(record)
    
    with open(file_name3, 'r') as csv_file:
        csv_data = list(reader(csv_file))
        for row in csv_data[1:]:
            record = defaultdict(dict)
            record['model'] = 'core.ItemVariation'
            record['pk'] = row[0]
            record['fields']['variation'] = row[1]
            record['fields']['value'] = row[3]
            record['fields']['attachment'] = 'images/' + row[4] + '.jpg'
            data.append(record)

    for id in range(71,141):
        record = defaultdict(dict)
        record['model'] = 'core.Variation'
        record['fields']['item'] = id - 70
        record['pk'] = id
        record['fields']['name'] = 'size'
        data.append(record)

    google_api = {
                    'model': 'socialaccount.SocialApp',
                    'pk': 1,
                    'fields': {
                            'provider': 'google',
                            'name': 'googleapi',
                            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
                            'secret': os.getenv('GOOGLE_SECRET_KEY'),
                            }
                    }

    github_api = {
                    'model': 'socialaccount.SocialApp',
                    'pk': 2,
                    'fields': {
                            'provider': 'github',
                            'name': 'githubapi',
                            'client_id': os.getenv('GITHUB_CLIENT_ID'),
                            'secret': os.getenv('GITHUB_SECRET_KEY'),
                            'key': os.getenv('GITHUB_KEY'),
                            }
                    }

    social_site = {
                    'model': 'sites.Site',
                    'pk': 1,
                    'fields': {
                            'domain': os.getenv('DOMAIN_NAME'),
                            'name': os.getenv('DISPLAY_NAME'),
                            }
                    }      

    data.extend([github_api, google_api, social_site])
    with open('./core/fixtures/images_data.json', 'w') as json_object:
        json_object.write(json.dumps(data, indent=4))
    print('Added csv file data to Json file...\n')



if __name__ == '__main__':

    csv_file_name1 = 'images_data.csv'
    csv_file_name2 = 'item color variations.csv'
    csv_file_name3 = 'item size variations.csv'
    # Reads data from csv file and transfers it to database tables
    csv_to_item_table(csv_file_name1, csv_file_name2, csv_file_name3)
