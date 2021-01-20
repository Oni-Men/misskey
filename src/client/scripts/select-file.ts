import { faUpload, faCloud, faLink } from '@fortawesome/free-solid-svg-icons';
import * as os from '@/os';
import { i18n } from '@/i18n';

export function selectFile(src: any, label: string | null, multiple = false) {
	return new Promise((res, rej) => {
		const chooseFileFromPc = () => {
			const input = document.createElement('input');
			input.type = 'file';
			input.multiple = multiple;
			input.onchange = () => {
				const promises = Array.from(input.files).map(file => os.upload(file));

				Promise.all(promises).then(driveFiles => {
					res(multiple ? driveFiles : driveFiles[0]);
				}).catch(e => {
					os.dialog({
						type: 'error',
						text: e
					});
				});
			};
			input.click();
		};

		const chooseFileFromDrive = () => {
			os.selectDriveFile(multiple).then(files => {
				res(files);
			});
		};

		const chooseFileFromUrl = () => {
			os.dialog({
				title: i18n.locale.uploadFromUrl,
				input: {
					placeholder: i18n.locale.uploadFromUrlDescription
				}
			}).then(({ canceled, result: url }) => {
				if (canceled) return;

				const marker = Math.random().toString(); // TODO: UUIDとか使う

				const connection = os.stream.useSharedConnection('main');
				connection.on('urlUploadFinished', data => {
					if (data.marker === marker) {
						res(multiple ? [data.file] : data.file);
						connection.dispose();
					}
				});

				os.api('drive/files/upload_from_url', {
					url: url,
					marker
				});

				os.dialog({
					title: i18n.locale.uploadFromUrlRequested,
					text: i18n.locale.uploadFromUrlMayTakeTime
				});
			});
		};

		os.modalMenu([label ? {
			text: label,
			type: 'label'
		} : undefined, {
			text: i18n.locale.upload,
			icon: faUpload,
			action: chooseFileFromPc
		}, {
			text: i18n.locale.fromDrive,
			icon: faCloud,
			action: chooseFileFromDrive
		}, {
			text: i18n.locale.fromUrl,
			icon: faLink,
			action: chooseFileFromUrl
		}], src);
	});
}
